---
title: "신호 손실 압축과 영상 압축"
date: "2025-07-06"
tags: ["Python", "푸리에 변환", "이산 웨이블릿 변환", "Haar 변환"]
lang: "ko"
author: ["권도한"]
description: "푸리에 변환과 이산 웨이블릿 변환에 대한 이해 그리고 영상 압축의 원리"
---

1차원 신호에 대해 [푸레에 변환](https://en.wikipedia.org/wiki/Fourier_transform) 혹은 [이산 웨이블릿(Haar) 변환](https://en.wikipedia.org/wiki/Haar_wavelet#Haar_transform)을 사용하면 신호를 주파수 대역으로 나눌 수 있으며, 주파수 중 고주파수를 제거하거나 양자화를 적용하면 신호를 손실 압축할 수 있다.

이를 활용하여, 각종 신호 및 영상의 손실 압축 과정을 알아보고자 한다.

```python
# 필요한 라이브러리
import numpy as np
from PIL import Image
import math
import os
import matplotlib.pyplot as plt
```

## 공통 함수 정의

먼저, 두 변환에서 모두 활용할 함수를 정의한다.

순서대로 스파스 표현, RLE 표현, 양자화, 감축율 계산, MSE 계산 등과 관련된 함수이다.

### 스파스 표현 (Sparse)

`[0, 5, 0, 0, 0, –3, 0, 0]`

위와 같은 신호는 스파스 표현 시 필요한 저장 공간을 줄일 수 있다.

스파스 표현은 신호에서 **`0`이 아닌 값을 `(인덱스, 값)`의 형태**로 바꾸어 신호의 총 길이와 함께 저장한다.

위 신호는 아래와 같이 표현된다.

`[(1,5),(5,-3)]`

수를 저장하는데에 1바이트가 필요하다고 가정한다면, 스파스 표현을 통해 필요한 저장 공간이 기존 8바이트에서 5바이트(신호의 총 길이를 포함)까지 줄었음을 알 수 있다.

```python
def sparse_encode(signal):
    sparse = []
    for i, val in enumerate(signal):
        if abs(val) > 1e-10:  # 거의 0인 값 제외
            sparse.append((i, val))
    return sparse

def sparse_decode(sparse_signal, length):
    signal = np.zeros(length, dtype=complex)
    for idx, val in sparse_signal:
        signal[idx] = val
    return signal
```

### RLE 표현 (Run-Length Encoding)

`[7, 7, 7, 7, 7, 2, 2, 0, 0, 0, 0, 0]`

위와 같은 신호는 **RLE(Run-Length Encoding)** 표현을 통해 필요 저장 공간을 줄일 수 있다.

RLE 표현은 **같은 값이 반복되는 구간의 값과 반복 횟수**를 묶어 `(값, 반복 횟수)` 형태로 저장한다.

위 신호는 아래와 같이 표현된다.

`[(7,5), (2,2), (0,5)]`

수를 저장하는 데 1바이트가 필요하다고 가정하면, 기존 표현은 12바이트가 필요하지만, RLE 표현은 총 6바이트만 사용하므로 필요 저장 공간이 줄어든다.

```python
def rle_encode(signal):
    encoded = []
    prev_val = signal[0]
    count = 1

    for val in signal[1:]:
        if abs(val - prev_val) < 1e-10:
            count += 1
        else:
            encoded.append((prev_val, count))
            prev_val = val
            count = 1
    encoded.append((prev_val, count))
    return encoded

def rle_decode(rle_signal):
    decoded = []
    for val, count in rle_signal:
        decoded.extend([val] * count)
    return np.array(decoded, dtype=complex)
```

### 균일 스칼라 양자화 (Uniform Scalar Quantization)

양자화는 연속적인 값을 가지는 신호를 이산적인 값으로 변환하는 과정이다.

신호 압축에서는 주로 계수들을 특정 **양자화 스텝(step)**으로 나누어 가장 가까운 양자화 레벨로 반올림함으로써 데이터의 정밀도를 낮추고 저장 공간을 절약한다.

균일 스칼라 양자화는 모든 계수에 대해 동일한 양자화 스텝을 적용하는 가장 기본적인 양자화 방법이다.

입력된 신호의 각 값을 step으로 나눈 후 반올림하고, 다시 step을 곱하여 양자화된 값을 반환하는 방법으로, 신호의 값들은 step의 배수로 표현되게 된다.

```python
def quantize(signals, step):
   return np.round(signals / step) * step
```

### 감축율 계산 (Reduction percentage)

압축을 통해 "몇 % 줄어들었는지"를 백분율로 보여주는 것으로 계산은 아래와 같다.

$$
   \mathrm{감축율} = \frac{\text{원본 비제로} - \text{압축 후 비제로}}{\text{원본 비제로}} \times 100\%
$$

비제로(0이 아닌 값의 개수)를 토대로 감축율을 게산한다.

```python
def signal_reduction_pct(original, compressed):
    orig_nonzero   = np.count_nonzero(np.abs(original)   > 1e-10)
    comp_nonzero   = np.count_nonzero(np.abs(compressed) > 1e-10)

    if orig_nonzero == 0:
        raise ValueError("원본 신호의 비제로 개수가 0입니다. 지표를 계산할 수 없습니다.")

    reduction_pct = (orig_nonzero - comp_nonzero) / orig_nonzero * 100
    return reduction_pct, orig_nonzero, comp_nonzero
```

### MSE 계산

$$
\mathrm{MSE} = \frac{1}{N}\sum_{i=1}^N \bigl(x_i - \hat x_i\bigr)^2
$$

- $x_i$: 원본 값
- $\hat x_i$: 복원(압축 후 복원) 값
- $N$: 샘플(또는 비교 요소)의 개수
- 오차의 제곱. 작은 오차보다는 큰 오차에 더 큰 페널티 부여
- 0에 가까울수록 원본에 가깝다는 의미 - 값이 커질수록 평균적으로 왜곡이 크다는 의미

```python
def calculate_mse(original, reconstructed):
    diff = original.astype(np.int16) - reconstructed.astype(np.int16)
    return np.mean(diff ** 2)

def calculate_image_mse(original_path:str, reconstructed_path:str):
    original_img = Image.open(original_path).convert("RGB")
    reconstructed_img = Image.open(reconstructed_path).convert("RGB")

    assert original_img.size == reconstructed_img.size, "이미지 크기가 다릅니다!"

    original = np.array(original_img).reshape(-1)  # R,G,B가 모두 펴짐 (1D)
    reconstructed = np.array(reconstructed_img).reshape(-1)

    mse_val = calculate_mse(original, reconstructed)
    return mse_val
```

### 평균 및 분산

```python
def calculate_signal_stats(signal):
    mean_val = sum(signal) / len(signal)
    variance = sum((x - mean_val) ** 2 for x in signal) / len(signal)
    return mean_val, variance
```

### 예시 1D 신호 생성

```python
def generate_signal(signal_choice):
  if signal_choice == '1':
      # 복합 사인파: 저주파 + 고주파 + 노이즈
      t = np.linspace(0, 4*np.pi, 128)
      x = (5 * np.sin(t) +
          2 * np.sin(5*t) +
          0.8 * np.sin(15*t) +
          0.5 * np.sin(25*t) +
          0.3 * np.random.randn(128))
      x = x + 100

  elif signal_choice == '2':
      # 펄스 신호
      x = np.zeros(128)
      x[20:30] = 100
      x[50:55] = 80
      x[80:90] = 60
      x += 0.5 * np.random.randn(128)

  elif signal_choice == '3':
      # 계단 함수 + 노이즈
      x = np.zeros(128)
      x[0:32] = 200
      x[32:64] = 150
      x[64:96] = 100
      x[96:128] = 50
      x += 2 * np.random.randn(128)

  else:
      # 원본 신호 (패딩하여 길이 늘림)
      original = np.array([240, 235, 230, 225, 200, 180, 160, 140, 120, 100, 90, 80, 75, 70, 65, 60], dtype=float)
      x = np.tile(original, 8)
      x += 0.5 * np.random.randn(128)

  return x
```

### 이미지 색상 채널 분리

```python
def load_bmp_image(file_path):
    image = Image.open(file_path)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    img_array = np.array(image)
    r_channel = img_array[:, :, 0]
    g_channel = img_array[:, :, 1]
    b_channel = img_array[:, :, 2]

    return r_channel, g_channel, b_channel, image.size
```

### 이미지 재구성

```python
def save_compressed_image(r_channel, g_channel, b_channel, output_path):
    # 값 범위를 0-255로 클리핑
    r_channel = np.clip(r_channel, 0, 255).astype(np.uint8)
    g_channel = np.clip(g_channel, 0, 255).astype(np.uint8)
    b_channel = np.clip(b_channel, 0, 255).astype(np.uint8)

    # RGB 채널을 합쳐서 컬러 이미지 생성
    rgb_array = np.stack([r_channel, g_channel, b_channel], axis=2)

    # PIL 이미지로 변환하여 저장
    compressed_image = Image.fromarray(rgb_array, 'RGB')
    compressed_image.save(output_path)
```

## 푸리에 변환 기반 손실 압축

파이썬의 numpy 라이브러리를 활용하여 푸리에 변환(FFT)을 수행한다.

```python
def fft_decompose(signal):
    fft_coeffs = np.fft.fft(signal)
    freqs = np.fft.fftfreq(len(signal))
    return fft_coeffs, freqs

def fft_reconstruct(fft_coeffs):
    reconstructed = np.fft.ifft(fft_coeffs).real
    return reconstructed

def low_pass_filter(fft_coeffs, freqs, cutoff_freq):
    # 저주파 통과 필터: 고주파수 성분 제거
    filtered_coeffs = fft_coeffs.copy()

    mask = np.abs(freqs) > cutoff_freq
    filtered_coeffs[mask] = 0

    removed_count = np.sum(mask)
    return filtered_coeffs, removed_count

def magnitude_threshold_filter(fft_coeffs, threshold):
    filtered_coeffs = fft_coeffs.copy()

    mask = np.abs(filtered_coeffs) < threshold
    filtered_coeffs[mask] = 0

    removed_count = np.sum(mask)
    return filtered_coeffs, removed_count
```

### 1D 신호 압축 예시

```python
# 신호 생성
# x = generate_signal(신호 종류)
print(len(x))
print(f"{x.min():.2f} ~ {x.max():.2f}")
print([f'{val:.1f}' for val in x[:16]])
```

```python
# 푸리에 변환
fft_coeffs, freqs = fft_decompose(x)
original_coeffs = fft_coeffs.copy()
print(fft_coeffs[0]:.3f)
print(len(fft_coeffs))
print([f'{c:.3f}' for c in fft_coeffs[:8]])
```

```python
# 저주파 통과 필터 (고주파수 제거)
# cutoff =
fft_coeffs, removed_count = low_pass_filter(fft_coeffs, freqs, cutoff)
print(removed_count)
print(len(fft_coeffs) - removed_count)
```

```python
# 고주파 통과 필터 (저주파수 제거)
# threshold =
fft_coeffs,f_removed_count = magnitude_threshold_filter(fft_coeffs, threshold)
print(f_removed_count-removed_count)
print(len(fft_coeffs) - f_removed_count)
```

```python
# 양자화 적용
# qstep = 양자화 단계
real_part = quantize(fft_coeffs.real,qstep)
imag_part = quantize(fft_coeffs.imag,qstep)
fft_coeffs = real_part + 1j * imag_part
print([f'{c:.3f}' for c in fft_coeffs[:8]])
```

```python
# 스파스 표현 적용
sparse_coeffs = sparse_encode(fft_coeffs)
print(len(x))
print(len(sparse_coeffs)*2)
print(sparse_coeffs[:5])

fft_coeffs = sparse_decode(sparse_coeffs, len(x))
```

```python
# RLE 적용
rle_coeffs = rle_encode(fft_coeffs)
print(len(x))
print(len(rle_coeffs)*2)
print(rle_coeffs[:5])

fft_coeffs = rle_decode(rle_coeffs)
```

```python
# 신호 복원
reconstructed = fft_reconstruct(fft_coeffs)

# 결과 출력 및 시각화
print([f'{x:.1f}' for x in x[:16]])
print([f'{x:.1f}' for x in reconstructed[:16]])

# 신호 중간 부분도 비교
mid_idx = len(x) // 2
print([f'{x:.1f}' for x in x[mid_idx:mid_idx+16]])
print([f'{x:.1f}' for x in reconstructed[mid_idx:mid_idx+16]])

# 성능 평가
ratio, original_nonzero,compressed_nonzero = signal_reduction_pct(original_coeffs, fft_coeffs)
print(f"{ratio:.1f}% ({original_nonzero} → {compressed_nonzero})")
print(f"MSE: {calculate_mse(x, reconstructed)}")

# 추가 분석
orig_mean, orig_var = calculate_signal_stats(x)
recon_mean, recon_var = calculate_signal_stats(reconstructed)
print(f"{orig_mean:.2f}, {orig_var:.2f}")
print(f"{recon_mean:.2f}, {recon_var:.2f}")
print(np.corrcoef(x, reconstructed)[0,1]:.4f)
```

### 영상 압축 예시

```python
def compress_image_fft(image_path, output_path, filter=0.05, threshold=0.002, quantization_step=1.0):
    # 푸리에 변환 기반 이미지 압축
    r_channel, g_channel, b_channel, image_size = load_bmp_image(image_path)

    channels = [r_channel.flatten(), g_channel.flatten(), b_channel.flatten()]
    compressed_channels = []

    for channel in channels:
        # FFT 변환
        fft_coeffs, freqs = fft_decompose(channel)

        # 저주파 통과 필터
        fft_coeffs, removed_count = low_pass_filter(fft_coeffs, freqs, filter)

        # 크기 기반 필터링
        max_magnitude = np.max(np.abs(fft_coeffs))
        fft_coeffs, removed_count = magnitude_threshold_filter(fft_coeffs, max_magnitude*threshold)

        # 양자화
        real_part = quantize(fft_coeffs.real, quantization_step)
        imag_part = quantize(fft_coeffs.imag, quantization_step)
        fft_coeffs = real_part + 1j * imag_part

        # 신호 복원
        reconstructed = fft_reconstruct(fft_coeffs)
        compressed_channels.append(reconstructed)

    # 2D로 복원 및 이미지 저장
    r_compressed = compressed_channels[0].reshape(r_channel.shape)
    g_compressed = compressed_channels[1].reshape(g_channel.shape)
    b_compressed = compressed_channels[2].reshape(b_channel.shape)
    save_compressed_image(r_compressed, g_compressed, b_compressed, output_path)

# input_img='MANDRILL.BMP'
# output_img='fft.BMP'
compress_image_fft(input_img, output_img)
print(f"MSE: {calculate_image_mse(input_img, output_img)}")

fig, axs = plt.subplots(1, 2, figsize=(10, 5))
original = Image.open(input_img)
reconstructed = Image.open(output_img)
axs[0].imshow(original)
axs[0].set_title("Original")
axs[0].axis("off")
axs[1].imshow(reconstructed)
axs[1].set_title("Reconstructed")
axs[1].axis("off")
plt.show()
```

![푸리에 변환 기반 영상 압축](/images/posts/fft.png)

## 이산 웨이블릿(Haar) 변환

Haar 변환은 Haar 웨이블릿을 통해 알 수 있듯, 평균과 그 차를 값으로 사용하여 보다 간단한 계산으로 주파수 분리가 가능함

```python
def haar_decompose(signal, levels):
    approx = signal[:]
    approxs = []
    details = []

    for level in range(levels):
        approx, detail = haar_step_decompose(approx)
        approxs.append(approx)
        details.append(detail)

    return approxs, details

def haar_step_decompose(signal):
    signal = np.asarray(signal, dtype=np.float32)
    approx = []
    detail = []
    for i in range(0, len(signal), 2):
        # 하르 변환
        a = (signal[i] + signal[i+1]) / 2
        d = (signal[i] - signal[i+1]) / 2
        approx.append(a)
        detail.append(d)
    return approx, detail

def haar_reconstruct(approxs, details):
    levels = len(approxs)
    approx = approxs[-1]
    for level in reversed(range(levels)):
        detail = details[level]
        approx = haar_step_reconstruct(approx, detail)
    return approx

def haar_step_reconstruct(approx, detail):
    signal = []
    for a, d in zip(approx, detail):
        signal.append(a + d)
        signal.append(a - d)
    return signal

def pad_to_pow2(signal):
    orig_len = len(signal)
    pow2_len = 2 ** int(np.ceil(np.log2(orig_len)))
    if pow2_len > orig_len:
        padded = np.zeros(pow2_len, dtype=signal.dtype)
        padded[:orig_len] = signal
        return padded, orig_len
    else:
        return signal, orig_len

def unpad(signal, orig_len):
    return signal[:orig_len]
```

### 1D 신호 압축 예시

```python
x = generate_signal(signal_choice)
print(len(x))
print(f"{x.min():.2f} ~ {x.max():.2f}")
print([f'{val:.1f}' for val in x[:16]])
```

```python
# 원본 신호 통계 저장
# L = 처리할 레벨
original_x = x[:]
approxs, dets = haar_decompose(x, L)
for level in range(L):
    approx_display = approxs[level][:8] if len(approxs[level]) > 8 else approxs[level]
    detail_display = dets[level][:8] if len(dets[level]) > 8 else dets[level]
    print(f"{level+1}: {[f'{x:.2f}' for x in approx_display]}")
    if len(approxs[level]) > 8:
        print(len(approxs[level]))
    print(f"{level+1}: {[f'{x:.2f}' for x in detail_display]}")
    if len(dets[level]) > 8:
        print(len(dets[level]))

# 원본 디테일 계수 저장 (압축률 계산용)
original_dets = [detail[:] for detail in dets]

# 디테일 길이 저장
detail_lengths = [len(d) for d in dets]
```

```python
# 크기 기반 필터 (작은 계수 제거)
c_dets = []
for i in range(len(dets)):
    max_magnitude = np.max(np.abs(dets[i]))
    # threshold = 임계값
    c_det, removed_count = magnitude_threshold_filter(np.array(dets[i]), threshold)
    c_dets.append(c_det)
    print(removed_count)
    print(len(dets[i]) - removed_count)
```

```python
# 양자화
# qstep = 양자화 단계
c_dets = []
for i in range(len(dets)):
    c_det = quantize(np.array(dets[i]), qstep)
    c_dets.append(c_det)
    print([f'{c:.3f}' for c in c_det[:8]])
dets = c_dets
```

```python
# 스파스 표현 적용
for i in range(len(dets)):
    sparse_dets = sparse_encode(np.array(dets[i]))
    print(len(dets[i]))
    print(len(sparse_dets)*2)
    print(sparse_dets[:5])
```

```python
# RLE 적용
for i in range(len(dets)):
    rle_dets = rle_encode(np.array(dets[i]))
    print(len(dets[i]))
    print(len(rle_dets)*2)
    print(rle_dets[:5])
```

```python
# 복구
reconstructed = haar_reconstruct(approxs, dets)
for level in range(L):
    approx_display = approxs[level][:8] if len(approxs[level]) > 8 else approxs[level]
    print(f"{level+1}: {[f'{x:.2f}' for x in approx_display]}")
    if len(approxs[level]) > 8:
        print(len(approxs[level]))

# 결과 분석 및 출력
print([f'{x:.1f}' for x in original_x[:16]])
print([f'{x:.1f}' for x in reconstructed[:16]])

# 신호 중간 부분도 비교
mid_idx = len(original_x) // 2
print([f'{x:.1f}' for x in original_x[mid_idx:mid_idx+16]])
print([f'{x:.1f}' for x in reconstructed[mid_idx:mid_idx+16]])

ratio, original_nonzero,compressed_nonzero = signal_reduction_pct(original_coeffs, fft_coeffs)
print(f"{ratio:.1f}% ({original_nonzero} → {compressed_nonzero})")
print(f"MSE: {calculate_mse(np.array(x), np.array(reconstructed))}")

orig_mean, orig_var = calculate_signal_stats(original_x)
recon_mean, recon_var = calculate_signal_stats(reconstructed)

print(f"{orig_mean:.2f}, {orig_var:.2f}")
print(f"{recon_mean:.2f}, {recon_var:.2f}")
print(np.corrcoef(x, reconstructed)[0,1]:.4f)
```

### 영상 압축 예시

```python
def compress_image_haar(image_path, output_path, threshold=0.3, quantization_step=30.0):
    # Haar 변환 기반 이미지 압축
    r_channel, g_channel, b_channel, image_size = load_bmp_image(image_path)

    channels = [r_channel.flatten(), g_channel.flatten(), b_channel.flatten()]
    compressed_channels = []

    for channel in channels:
        # 길이를 2의 거듭제곱으로 패딩
        channel_padded, orig_len = pad_to_pow2(channel)

        # Haar 변환
        approxs, details = haar_decompose(np.array(channel_padded), int(np.log2(len(channel_padded))))

        # 디테일 계수 압축
        for level in range(len(details)):
            max_magnitude = np.max(np.abs(details[level]))
            details[level], _ = magnitude_threshold_filter(np.array(details[level]), max_magnitude*threshold)
            details[level] = quantize(np.array(details[level]), quantization_step)

        # 신호 복원
        reconstructed = haar_reconstruct(approxs, details)
        reconstructed = unpad(reconstructed, orig_len)
        compressed_channels.append(reconstructed)

    # 2D로 복원 및 이미지 저장
    r_compressed = np.array(compressed_channels[0][:np.prod(r_channel.shape)]).reshape(r_channel.shape)
    g_compressed = np.array(compressed_channels[1][:np.prod(g_channel.shape)]).reshape(g_channel.shape)
    b_compressed = np.array(compressed_channels[2][:np.prod(b_channel.shape)]).reshape(b_channel.shape)

    save_compressed_image(r_compressed, g_compressed, b_compressed, output_path)

# input_img='MANDRILL.BMP'
# output_img='fft.BMP'
compress_image_haar(input_img, output_img)
print(f"MSE: {calculate_image_mse(input_img, output_img)}")

fig, axs = plt.subplots(1, 2, figsize=(10, 5))
original = Image.open(input_img)
reconstructed = Image.open(output_img)
axs[0].imshow(original)
axs[0].set_title("Original")
axs[0].axis("off")
axs[1].imshow(reconstructed)
axs[1].set_title("Reconstructed")
axs[1].axis("off")
plt.show()
```

![Haar 변환 기반 영상 압축](/images/posts/haar.png)

---

# 결론

- 퓨리에 변환은 영상의 전반으로 압축이 일어남.
- Haar 변환은 배경과 같이 보다 중요하지 않은 부분을 포집하여 집중적으로 압축이 일어남.
- 이는 Haar 변환이 영상의 인접 픽셀 간 평균 및 차이를 통한 분석으로 이루어지기 때문.
