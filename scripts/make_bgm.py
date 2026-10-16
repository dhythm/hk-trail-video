"""香港トレイル紹介動画のBGMを numpy だけで合成する。

96 BPM（1小節 = 2.5 秒）。動画構成の区切り
(20/40/70/95/120/145/180/210/235/280 秒) がすべて小節頭に揃う。

usage: python3 make_bgm.py <出力wav>
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
TOTAL = 300.0
N = int(SR * TOTAL)
rng = np.random.default_rng(7)


def bar_t(bar: float) -> float:
    return bar * BAR


def midi_hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


class Stem:
    def __init__(self) -> None:
        self.l = np.zeros(N, np.float32)
        self.r = np.zeros(N, np.float32)

    def add(self, t: float, sig: np.ndarray, gain: float = 1.0, pan: float = 0.0) -> None:
        i = int(t * SR)
        if i >= N or i + len(sig) <= 0:
            return
        j0 = max(0, -i)
        sig = sig[j0:]
        i = max(i, 0)
        n = min(len(sig), N - i)
        gl = gain * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        gr = gain * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        self.l[i : i + n] += sig[:n] * gl
        self.r[i : i + n] += sig[:n] * gr

    def mul(self, env: np.ndarray) -> None:
        self.l *= env
        self.r *= env


def tvec(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR), dtype=np.float32) / SR


def adsr(n: int, a: float, r: float) -> np.ndarray:
    env = np.ones(n, np.float32)
    na, nr = int(a * SR), int(r * SR)
    if na:
        env[: min(na, n)] = np.linspace(0, 1, min(na, n))
    if nr and nr < n:
        env[-nr:] *= np.linspace(1, 0, nr)
    return env


def saw(f: float, t: np.ndarray, harmonics: int, phase: float = 0.0) -> np.ndarray:
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if f * k > SR / 2.2:
            break
        out += np.sin(2 * np.pi * f * k * t + phase * k) / k
    return out * 0.6


# ---------- 楽器 ----------

def pad_note(m: float, dur: float, bright: int = 8) -> np.ndarray:
    t = tvec(dur + 1.2)
    f = midi_hz(m)
    sig = sum(saw(f * d, t, bright, rng.uniform(0, 6)) for d in (0.996, 1.0, 1.004))
    return (sig / 3 * adsr(len(t), 0.7, 1.4)).astype(np.float32)


def pluck(m: float, dur: float = 0.6, decay: float = 4.0) -> np.ndarray:
    t = tvec(dur)
    f = midi_hz(m)
    sig = np.zeros_like(t)
    for k in range(1, 9):
        sig += np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * (decay + k * 2.2))
    return (sig * adsr(len(t), 0.002, 0.05)).astype(np.float32)


def bell(m: float, dur: float = 1.6) -> np.ndarray:
    t = tvec(dur)
    f = midi_hz(m)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 1.2 * np.exp(-t * 3)
    sig = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 2.4)
    return (sig * adsr(len(t), 0.003, 0.2)).astype(np.float32)


def lead(m: float, dur: float) -> np.ndarray:
    t = tvec(dur + 0.25)
    f = midi_hz(m)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / 0.4, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    sig = np.zeros_like(t)
    for k in (1, 3, 5, 7):
        sig += np.sin(ph * k) / (k * k) * (1 if k == 1 else 0.9)
    sig += 0.25 * saw(f, t, 6)
    return (sig * adsr(len(t), 0.03, 0.25)).astype(np.float32)


def bass_note(m: float, dur: float) -> np.ndarray:
    t = tvec(dur)
    f = midi_hz(m)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * saw(f, t, 5)
    return (np.tanh(sig * 1.4) * adsr(len(t), 0.005, 0.06)).astype(np.float32)


def kick() -> np.ndarray:
    t = tvec(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.sin(ph) * np.exp(-t * 7.5)
    sig[:120] += rng.uniform(-1, 1, 120) * np.linspace(0.5, 0, 120)
    return np.tanh(sig * 1.8).astype(np.float32)


def hp_noise(n: int, k: int = 3) -> np.ndarray:
    x = rng.uniform(-1, 1, n).astype(np.float32)
    smooth = np.convolve(x, np.ones(k) / k, mode="same")
    return x - smooth


def bp_noise(n: int, lo: int = 3, hi: int = 18) -> np.ndarray:
    x = rng.uniform(-1, 1, n).astype(np.float32)
    a = np.convolve(x, np.ones(lo) / lo, mode="same")
    b = np.convolve(x, np.ones(hi) / hi, mode="same")
    return a - b


def clap() -> np.ndarray:
    t = tvec(0.35)
    env = np.exp(-t * 14)
    for off in (0.0, 0.011, 0.022):
        i = int(off * SR)
        env[i : i + 200] += np.linspace(0.8, 0, 200)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.4
    return (bp_noise(len(t), 2, 10) * 2.2 * env + body).astype(np.float32)


def hat(open_: bool = False) -> np.ndarray:
    t = tvec(0.3 if open_ else 0.06)
    return (hp_noise(len(t), 2) * np.exp(-t * (9 if open_ else 70))).astype(np.float32)


def shaker() -> np.ndarray:
    t = tvec(0.09)
    return (hp_noise(len(t), 3) * np.sin(np.pi * np.clip(t / 0.09, 0, 1)) ** 2).astype(np.float32)


def tom(m: float) -> np.ndarray:
    t = tvec(0.6)
    f = midi_hz(m) * (1 + 0.6 * np.exp(-t * 20))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-t * 6)).astype(np.float32)


def crash(dur: float = 2.6) -> np.ndarray:
    t = tvec(dur)
    return (hp_noise(len(t), 2) * np.exp(-t * 1.7) * adsr(len(t), 0.002, 0.3)).astype(np.float32)


def impact() -> np.ndarray:
    t = tvec(3.0)
    f = 62 * np.exp(-t * 0.9) + 26
    ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * np.exp(-t * 1.3)
    noise = bp_noise(len(t), 6, 40) * np.exp(-t * 4) * 0.8
    return np.tanh((sub + noise) * 1.6).astype(np.float32)


def riser(dur: float) -> np.ndarray:
    t = tvec(dur)
    p = t / dur
    noise = hp_noise(len(t), 2) * p ** 2.2
    f = 200 + 1600 * p ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * p ** 3 * 0.25
    return ((noise + tone) * adsr(len(t), 0.05, 0.02)).astype(np.float32)


def whoosh(dur: float = 0.7) -> np.ndarray:
    """転換用の短いリバース系ノイズ"""
    t = tvec(dur)
    p = t / dur
    return (bp_noise(len(t), 2, 12) * (p ** 2.5) * adsr(len(t), 0.01, 0.03)).astype(np.float32)


# ---------- 和声と構成 ----------
# D major：I – V – vi – IV
PROG_MAIN = [(50, [62, 66, 69, 74]), (45, [61, 64, 69, 73]), (47, [62, 66, 71, 74]), (43, [62, 67, 71, 74])]
# 第4区間・第6区間用：vi – IV – I – V（陰影）
PROG_SHADE = [(47, [62, 66, 71, 74]), (43, [62, 67, 71, 74]), (50, [62, 66, 69, 74]), (45, [61, 64, 69, 73])]

# (開始小節, 終了小節, パート設定)
ARRANGE = [
    (0, 8, dict(name="intro")),
    (8, 16, dict(name="overview")),
    (16, 28, dict(name="s1")),
    (28, 38, dict(name="s2")),
    (38, 48, dict(name="s3")),
    (48, 58, dict(name="s4")),
    (58, 72, dict(name="s5")),
    (72, 84, dict(name="s6")),
    (84, 94, dict(name="s7")),
    (94, 112, dict(name="s8")),
    (112, 120, dict(name="outro")),
]

# 4小節フレーズ（拍位置, MIDI, 長さ[拍]）
MELODY = [
    [(0, 78, 1.5), (1.5, 81, 0.5), (2, 83, 1), (3, 81, 1)],
    [(0, 76, 1.5), (1.5, 78, 0.5), (2, 76, 1), (3, 73, 1)],
    [(0, 74, 1), (1, 78, 1), (2, 83, 1.5), (3.5, 81, 0.5)],
    [(0, 83, 2), (2, 81, 1), (3, 78, 1)],
]
MELODY_B = [
    [(0, 81, 1), (1, 83, 0.5), (1.5, 86, 1.5), (3, 85, 1)],
    [(0, 81, 2), (2, 78, 1), (3, 76, 1)],
    [(0, 78, 1), (1, 83, 1), (2, 86, 1), (3, 88, 1)],
    [(0, 86, 2.5), (2.5, 85, 0.5), (3, 81, 1)],
]


def section_of(bar: int) -> str:
    for a, b, cfg in ARRANGE:
        if a <= bar < b:
            return cfg["name"]
    return "outro"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out_path = sys.argv[1]

    pad, keys, bass, drums, leadst, fx = (Stem() for _ in range(6))
    kick_times: list[float] = []

    for bar in range(120):
        sec = section_of(bar)
        t0 = bar_t(bar)
        prog = PROG_SHADE if sec in ("s4", "s6") else PROG_MAIN
        root, chord = prog[bar % 4]

        # --- パッド：常時（イントロ冒頭とアウトロ末尾は控えめ）
        pad_gain = {"intro": 0.14, "s3": 0.34, "s6": 0.28, "outro": 0.12}.get(sec, 0.12)
        bright = 5 if sec in ("s3", "s6", "intro") else 9
        if bar < 119:
            for i, m in enumerate(chord):
                pad.add(t0, pad_note(m - 12 if i == 0 else m, BAR, bright), pad_gain / 2, pan=(-0.5 + i / 3))
        else:
            for i, m in enumerate(chord):
                pad.add(t0, pad_note(m, BAR * 2.2, 6), 0.08, pan=(-0.5 + i / 3))

        # --- アルペジオ（16分）
        arp_on = sec not in ("intro",) or bar >= 4
        if sec == "outro" and bar >= 116:
            arp_on = False
        if arp_on:
            pattern = [0, 1, 2, 3, 2, 1, 2, 3] * 2
            for s, idx in enumerate(pattern):
                if sec in ("s3", "s6") and s % 2:
                    continue
                note = chord[idx] + (12 if s >= 8 and sec in ("s5", "s8") else 0)
                inst = bell(note, 1.2) if sec in ("s3", "s6") else pluck(note, 0.45)
                g = 0.16 if sec in ("s3", "s6") else 0.06
                keys.add(t0 + s * BEAT / 4, inst, g, pan=0.35 if s % 2 else -0.35)

        # --- イントロのインパクト（言葉が叩きつけられる 0,1,2,3 小節）
        if sec == "intro" and bar < 4:
            fx.add(t0, impact(), 0.55)
            fx.add(t0 - 0.7, whoosh(0.7), 0.25)
        if sec == "intro" and bar == 6:
            fx.add(t0, riser(BAR * 2), 0.35)

        # --- ドラム
        groove = sec in ("overview", "s1", "s2", "s5", "s7", "s8") or (sec == "intro" and 4 <= bar < 6)
        if sec == "s5" and bar < 62:
            groove = bar % 2 == 0  # 登りはじめは間引き
        if sec == "outro" and bar < 116:
            groove = True
        if groove:
            kicks = [0, 2.5] if sec in ("intro",) else [0, 1.5, 2, 3.5] if sec in ("s8", "s1") else [0, 1.75, 2.5]
            for b in kicks:
                drums.add(t0 + b * BEAT, kick(), 0.85)
                kick_times.append(t0 + b * BEAT)
            if sec != "intro":
                for b in (1, 3):
                    drums.add(t0 + b * BEAT, clap(), 0.32, pan=0.05)
            for s in range(8):
                swing = 0.03 if s % 2 else 0.0
                drums.add(t0 + (s / 2 + swing) * BEAT, hat(), 0.16 if s % 2 else 0.1, pan=0.3)
            if sec in ("s8", "s7") and bar % 2 == 1:
                drums.add(t0 + 3.5 * BEAT, hat(True), 0.12, pan=-0.3)
        if sec in ("s3", "s6"):
            for s in range(16):
                drums.add(t0 + (s / 4 + (0.02 if s % 2 else 0)) * BEAT, shaker(), 0.12 if s % 2 else 0.07, pan=-0.2)
        if sec == "s4":
            drums.add(t0, kick(), 0.7)
            kick_times.append(t0)
            drums.add(t0 + 2 * BEAT, tom(45), 0.45, pan=-0.2)
            drums.add(t0 + 3 * BEAT, tom(40), 0.4, pan=0.2)
            drums.add(t0 + 3.5 * BEAT, tom(38), 0.3, pan=0.25)
            for s in range(8):
                drums.add(t0 + s / 2 * BEAT, hat(), 0.07, pan=0.3)

        # --- ベース
        if groove or sec == "s4":
            for b, d in ([(0, 0.75), (0.75, 0.5), (1.5, 0.5), (2, 0.75), (2.75, 0.5), (3.5, 0.5)] if sec != "s4" else [(0, 1.5), (2, 1.5)]):
                bass.add(t0 + b * BEAT, bass_note(root - 12 if root > 45 else root, d * BEAT), 0.32)
        if sec == "s6":
            bass.add(t0, bass_note(root - 12 if root > 45 else root, BAR * 0.9), 0.22)

        # --- リード
        if sec in ("s1", "s8") or (sec == "s7" and bar >= 88):
            phrase = MELODY_B if (sec == "s8" and bar >= 102) else MELODY
            for b, m, d in phrase[bar % 4]:
                leadst.add(t0 + b * BEAT, lead(m, d * BEAT), 0.11 if sec != "s8" else 0.13, pan=0.1)

        # --- 区切りのクラッシュ
        if bar in (8, 16, 28, 58, 84, 94, 102, 112):
            drums.add(t0, crash(), 0.22, pan=-0.15)
        if bar in (15, 27, 37, 47, 57, 71, 83, 93, 111):
            fx.add(t0 + BAR - 0.7, whoosh(0.7), 0.22)
        if bar in (70, 92):
            fx.add(t0, riser(BAR * 2), 0.28)

    # --- サイドチェイン：キックに合わせてパッド・キー・ベースを沈める
    sc = np.ones(N, np.float32)
    rel = tvec(0.32)
    duck = 1 - 0.55 * np.exp(-rel / 0.09)
    for kt in kick_times:
        i = int(kt * SR)
        n = min(len(duck), N - i)
        if n > 0:
            sc[i : i + n] = np.minimum(sc[i : i + n], duck[:n])
    pad.mul(sc)
    keys.mul(sc)
    bass.mul(np.sqrt(sc))

    # --- リバーブ（FFT 畳み込み、ステレオのノイズ IR）
    def reverb(x: np.ndarray, seed: int, length: float = 2.4) -> np.ndarray:
        r = np.random.default_rng(seed)
        it = tvec(length)
        ir = (r.uniform(-1, 1, len(it)) * np.exp(-it * 2.6)).astype(np.float32)
        ir = np.convolve(ir, np.ones(6) / 6, mode="same")  # 高域を少し丸める
        ir /= np.sqrt(np.sum(ir ** 2))
        block = 1 << 18
        nfft = 1 << int(np.ceil(np.log2(block + len(ir))))
        IR = np.fft.rfft(ir, nfft)
        y = np.zeros(len(x) + len(ir), np.float32)
        for s in range(0, len(x), block):
            seg = x[s : s + block]
            conv = np.fft.irfft(np.fft.rfft(seg, nfft) * IR, nfft)[: len(seg) + len(ir)]
            y[s : s + len(conv)] += conv
        return y[: len(x)]

    send_l = pad.l * 0.5 + keys.l * 0.8 + leadst.l * 0.6 + drums.l * 0.08 + fx.l * 0.4
    send_r = pad.r * 0.5 + keys.r * 0.8 + leadst.r * 0.6 + drums.r * 0.08 + fx.r * 0.4
    rev_l = reverb(send_l, 1)
    rev_r = reverb(send_r, 2)

    mix_l = pad.l + keys.l + bass.l + drums.l + leadst.l + fx.l + rev_l * 0.35
    mix_r = pad.r + keys.r + bass.r + drums.r + leadst.r + fx.r + rev_r * 0.35

    # --- マスター：フェード、ソフトクリップ、ノーマライズ
    t = np.arange(N) / SR
    fade = np.clip(t / 0.3, 0, 1) * np.clip((TOTAL - t) / 4.0, 0, 1)
    mix = np.stack([mix_l, mix_r], axis=1) * fade[:, None]
    mix = np.tanh(mix * 1.1)
    peak = np.max(np.abs(mix))
    if peak <= 0:
        raise RuntimeError("silent mix")
    mix = mix / peak * 0.89
    pcm = (mix * 32767).astype(np.int16)

    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {out_path} ({TOTAL:.0f}s)")


if __name__ == "__main__":
    main()
