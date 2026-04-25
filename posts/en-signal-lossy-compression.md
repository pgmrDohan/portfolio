---
title: "Lossy Compression of Signals and Image Compression"
date: "2025-07-06"
tags:
  - "Python"
  - "Fourier Transform"
  - "Discrete Wavelet Transform"
  - "Haar Transform"
lang: "en"
author: ["Dohan Kwon"]
description: "Understanding the Fourier Transform and Discrete Wavelet Transform, and the principles of image compression"
---

For a one-dimensional signal, by using the [Fourier Transform](https://en.wikipedia.org/wiki/Fourier_transform) or the [Discrete Wavelet (Haar) Transform](https://en.wikipedia.org/wiki/Haar_wavelet#Haar_transform), the signal can be divided into frequency bands. By removing high-frequency components or applying quantization, the signal can be lossily compressed.

Using this, we aim to examine the process of lossy compression for various signals and images.

```python
# Required libraries
import numpy as np
from PIL import Image
import math
import os
import matplotlib.pyplot as plt
```

## Common Function Definitions

First, define functions that will be used in both transforms.

In order: functions related to sparse representation, RLE representation, quantization, reduction rate calculation, MSE calculation, etc.

### Sparse Representation

`[0, 5, 0, 0, 0, –3, 0, 0]`

A signal like the above can reduce required storage space when using sparse representation.

Sparse representation stores **non-zero values in the form of `(index, value)`**, along with the total length of the signal.

The above signal is represented as follows:

`[(1,5),(5,-3)]`

Assuming that storing a number requires 1 byte, the required storage space is reduced from 8 bytes to 5 bytes (including the total signal length).

```python
def sparse_encode(signal):
    sparse = []
    for i, val in enumerate(signal):
        if abs(val) > 1e-10:  # exclude values close to 0
            sparse.append((i, val))
    return sparse

def sparse_decode(sparse_signal, length):
    signal = np.zeros(length, dtype=complex)
    for idx, val in sparse_signal:
        signal[idx] = val
    return signal
```

### RLE Representation (Run-Length Encoding)

`[7, 7, 7, 7, 7, 2, 2, 0, 0, 0, 0, 0]`

A signal like the above can reduce required storage space using **RLE (Run-Length Encoding)**.

RLE stores **the value and the number of repetitions for consecutive identical values** in the form `(value, count)`.

The above signal is represented as follows:

`[(7,5), (2,2), (0,5)]`

Assuming storing a number requires 1 byte, the original representation requires 12 bytes, while the RLE representation uses only 6 bytes.

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

### Uniform Scalar Quantization

Quantization is the process of converting a signal with continuous values into discrete values.

In signal compression, coefficients are typically divided by a specific **quantization step** and rounded to the nearest quantization level, reducing precision and saving storage space.

Uniform scalar quantization applies the same quantization step to all coefficients.

Each value in the input signal is divided by the step, rounded, and multiplied back by the step, so all values become multiples of the step.

```python
def quantize(signals, step):
   return np.round(signals / step) * step
```

### Reduction Percentage

This shows "how much it was reduced (%)" through compression, calculated as follows:

$$
\frac{\text{Original non-zero} - \text{Compressed non-zero}}{\text{Original non-zero}} \times 100%
$$

The reduction percentage is calculated based on the number of non-zero values.

```python
def signal_reduction_pct(original, compressed):
    orig_nonzero   = np.count_nonzero(np.abs(original)   > 1e-10)
    comp_nonzero   = np.count_nonzero(np.abs(compressed) > 1e-10)

    if orig_nonzero == 0:
        raise ValueError("The original signal has zero non-zero elements. Cannot compute metric.")

    reduction_pct = (orig_nonzero - comp_nonzero) / orig_nonzero * 100
    return reduction_pct, orig_nonzero, comp_nonzero
```

### MSE Calculation

$$
\mathrm{MSE} = \frac{1}{N}\sum_{i=1}^N \bigl(x_i - \hat x_i\bigr)^2
$$

- $x_i$: original value
- $\hat x_i$: reconstructed (after compression) value
- $N$: number of samples (or elements compared)
- Squared error: larger errors are penalized more than smaller ones
- Closer to 0 means closer to the original; larger values indicate greater distortion on average

```python
def calculate_mse(original, reconstructed):
    diff = original.astype(np.int16) - reconstructed.astype(np.int16)
    return np.mean(diff ** 2)

def calculate_image_mse(original_path:str, reconstructed_path:str):
    original_img = Image.open(original_path).convert("RGB")
    reconstructed_img = Image.open(reconstructed_path).convert("RGB")

    assert original_img.size == reconstructed_img.size, "Image sizes are different!"

    original = np.array(original_img).reshape(-1)
    reconstructed = np.array(reconstructed_img).reshape(-1)

    mse_val = calculate_mse(original, reconstructed)
    return mse_val
```

### Mean and Variance

```python
def calculate_signal_stats(signal):
    mean_val = sum(signal) / len(signal)
    variance = sum((x - mean_val) ** 2 for x in signal) / len(signal)
    return mean_val, variance
```

### Generate Example 1D Signal

```python
def generate_signal(signal_choice):
  if signal_choice == '1':
      # Composite sine wave: low + high frequency + noise
      t = np.linspace(0, 4*np.pi, 128)
      x = (5 * np.sin(t) +
          2 * np.sin(5*t) +
          0.8 * np.sin(15*t) +
          0.5 * np.sin(25*t) +
          0.3 * np.random.randn(128))
      x = x + 100

  elif signal_choice == '2':
      # Pulse signal
      x = np.zeros(128)
      x[20:30] = 100
      x[50:55] = 80
      x[80:90] = 60
      x += 0.5 * np.random.randn(128)

  elif signal_choice == '3':
      # Step function + noise
      x = np.zeros(128)
      x[0:32] = 200
      x[32:64] = 150
      x[64:96] = 100
      x[96:128] = 50
      x += 2 * np.random.randn(128)

  else:
      # Original signal (padded)
      original = np.array([240, 235, 230, 225, 200, 180, 160, 140, 120, 100, 90, 80, 75, 70, 65, 60], dtype=float)
      x = np.tile(original, 8)
      x += 0.5 * np.random.randn(128)

  return x
```

### Separate Image Color Channels

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

### Reconstruct Image

```python
def save_compressed_image(r_channel, g_channel, b_channel, output_path):
    # Clipping (0-255)
    r_channel = np.clip(r_channel, 0, 255).astype(np.uint8)
    g_channel = np.clip(g_channel, 0, 255).astype(np.uint8)
    b_channel = np.clip(b_channel, 0, 255).astype(np.uint8)

    # Reconstruct Image
    rgb_array = np.stack([r_channel, g_channel, b_channel], axis=2)

    # PIL Image Save
    compressed_image = Image.fromarray(rgb_array, 'RGB')
    compressed_image.save(output_path)
```

## Fourier Transform-Based Lossy Compression

Use Python's numpy library to perform the Fourier Transform (FFT).

```python
def fft_decompose(signal):
    fft_coeffs = np.fft.fft(signal)
    freqs = np.fft.fftfreq(len(signal))
    return fft_coeffs, freqs

def fft_reconstruct(fft_coeffs):
    reconstructed = np.fft.ifft(fft_coeffs).real
    return reconstructed

def low_pass_filter(fft_coeffs, freqs, cutoff_freq):
    # Low pass filter
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

### 1D Signal Compression Example

```python
# Generate signal
# x = generate_signal(signal_type)
print(len(x))
print(f"{x.min():.2f} ~ {x.max():.2f}")
print([f'{val:.1f}' for val in x[:16]])
```

```python
# Fourier Transform
fft_coeffs, freqs = fft_decompose(x)
original_coeffs = fft_coeffs.copy()
print(f"{fft_coeffs[0]:.3f}")
print(len(fft_coeffs))
print([f'{c:.3f}' for c in fft_coeffs[:8]])
```

```python
# Low-pass filter (remove high-frequency components)
# cutoff =
fft_coeffs, removed_count = low_pass_filter(fft_coeffs, freqs, cutoff)
print(removed_count)
print(len(fft_coeffs) - removed_count)
```

```python
# Magnitude threshold filter (remove small coefficients)
# threshold =
fft_coeffs, f_removed_count = magnitude_threshold_filter(fft_coeffs, threshold)
print(f_removed_count - removed_count)
print(len(fft_coeffs) - f_removed_count)
```

```python
# Apply quantization
# qstep = quantization step
real_part = quantize(fft_coeffs.real, qstep)
imag_part = quantize(fft_coeffs.imag, qstep)
fft_coeffs = real_part + 1j * imag_part
print([f'{c:.3f}' for c in fft_coeffs[:8]])
```

```python
# Apply sparse representation
sparse_coeffs = sparse_encode(fft_coeffs)
print(len(x))
print(len(sparse_coeffs) * 2)
print(sparse_coeffs[:5])

fft_coeffs = sparse_decode(sparse_coeffs, len(x))
```

```python
# Apply RLE
rle_coeffs = rle_encode(fft_coeffs)
print(len(x))
print(len(rle_coeffs) * 2)
print(rle_coeffs[:5])

fft_coeffs = rle_decode(rle_coeffs)
```

```python
# Reconstruct signal
reconstructed = fft_reconstruct(fft_coeffs)

# Output results and visualize
print([f'{x:.1f}' for x in x[:16]])
print([f'{x:.1f}' for x in reconstructed[:16]])

# Compare middle section of the signal
mid_idx = len(x) // 2
print([f'{x:.1f}' for x in x[mid_idx:mid_idx+16]])
print([f'{x:.1f}' for x in reconstructed[mid_idx:mid_idx+16]])

# Performance evaluation
ratio, original_nonzero, compressed_nonzero = signal_reduction_pct(original_coeffs, fft_coeffs)
print(f"{ratio:.1f}% ({original_nonzero} → {compressed_nonzero})")
print(f"MSE: {calculate_mse(x, reconstructed)}")

# Additional analysis
orig_mean, orig_var = calculate_signal_stats(x)
recon_mean, recon_var = calculate_signal_stats(reconstructed)
print(f"{orig_mean:.2f}, {orig_var:.2f}")
print(f"{recon_mean:.2f}, {recon_var:.2f}")
print(f"{np.corrcoef(x, reconstructed)[0,1]:.4f}")
```

### Image Compression Example

```python
def compress_image_fft(image_path, output_path, filter=0.05, threshold=0.002, quantization_step=1.0):
    # Image compression based on Fourier Transform
    r_channel, g_channel, b_channel, image_size = load_bmp_image(image_path)

    channels = [r_channel.flatten(), g_channel.flatten(), b_channel.flatten()]
    compressed_channels = []

    for channel in channels:
        # FFT transform
        fft_coeffs, freqs = fft_decompose(channel)

        # Low-pass filter
        fft_coeffs, removed_count = low_pass_filter(fft_coeffs, freqs, filter)

        # Magnitude-based filtering
        max_magnitude = np.max(np.abs(fft_coeffs))
        fft_coeffs, removed_count = magnitude_threshold_filter(fft_coeffs, max_magnitude * threshold)

        # Quantization
        real_part = quantize(fft_coeffs.real, quantization_step)
        imag_part = quantize(fft_coeffs.imag, quantization_step)
        fft_coeffs = real_part + 1j * imag_part

        # Signal reconstruction
        reconstructed = fft_reconstruct(fft_coeffs)
        compressed_channels.append(reconstructed)

    # Restore to 2D and save image
    r_compressed = compressed_channels[0].reshape(r_channel.shape)
    g_compressed = compressed_channels[1].reshape(g_channel.shape)
    b_compressed = compressed_channels[2].reshape(b_channel.shape)
    save_compressed_image(r_compressed, g_compressed, b_compressed, output_path)

# input_img = 'MANDRILL.BMP'
# output_img = 'fft.BMP'
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

![Image compression based on Fourier Transform](/images/projects/fft.png)

## Discrete Wavelet (Haar) Transform

The Haar transform allows frequency separation using averages and differences, enabling simpler computation.

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
        # Haar Transform
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

### 1D Signal Compression Example

```python
# Generate signal
x = generate_signal(signal_choice)
print(len(x))
print(f"{x.min():.2f} ~ {x.max():.2f}")
print([f'{val:.1f}' for val in x[:16]])
```

```python
# Store original signal statistics
# L = number of decomposition levels
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

# Store original detail coefficients (for compression ratio calculation)
original_dets = [detail[:] for detail in dets]

# Store detail lengths
detail_lengths = [len(d) for d in dets]
```

```python
# Magnitude-based filtering (remove small coefficients)
c_dets = []
for i in range(len(dets)):
    max_magnitude = np.max(np.abs(dets[i]))
    # threshold = threshold value
    c_det, removed_count = magnitude_threshold_filter(np.array(dets[i]), threshold)
    c_dets.append(c_det)
    print(removed_count)
    print(len(dets[i]) - removed_count)
```

```python
# Quantization
# qstep = quantization step
c_dets = []
for i in range(len(dets)):
    c_det = quantize(np.array(dets[i]), qstep)
    c_dets.append(c_det)
    print([f'{c:.3f}' for c in c_det[:8]])

dets = c_dets
```

```python
# Apply sparse representation
for i in range(len(dets)):
    sparse_dets = sparse_encode(np.array(dets[i]))
    print(len(dets[i]))
    print(len(sparse_dets) * 2)
    print(sparse_dets[:5])
```

```python
# Apply RLE
for i in range(len(dets)):
    rle_dets = rle_encode(np.array(dets[i]))
    print(len(dets[i]))
    print(len(rle_dets) * 2)
    print(rle_dets[:5])
```

```python
# Reconstruction
reconstructed = haar_reconstruct(approxs, dets)

for level in range(L):
    approx_display = approxs[level][:8] if len(approxs[level]) > 8 else approxs[level]
    print(f"{level+1}: {[f'{x:.2f}' for x in approx_display]}")
    if len(approxs[level]) > 8:
        print(len(approxs[level]))

# Result analysis and output
print([f'{x:.1f}' for x in original_x[:16]])
print([f'{x:.1f}' for x in reconstructed[:16]])

# Compare middle section of the signal
mid_idx = len(original_x) // 2
print([f'{x:.1f}' for x in original_x[mid_idx:mid_idx+16]])
print([f'{x:.1f}' for x in reconstructed[mid_idx:mid_idx+16]])

ratio, original_nonzero, compressed_nonzero = signal_reduction_pct(original_coeffs, fft_coeffs)
print(f"{ratio:.1f}% ({original_nonzero} → {compressed_nonzero})")
print(f"MSE: {calculate_mse(np.array(x), np.array(reconstructed))}")

orig_mean, orig_var = calculate_signal_stats(original_x)
recon_mean, recon_var = calculate_signal_stats(reconstructed)

print(f"{orig_mean:.2f}, {orig_var:.2f}")
print(f"{recon_mean:.2f}, {recon_var:.2f}")
print(f"{np.corrcoef(x, reconstructed)[0,1]:.4f}")
```

---

### Image Compression Example

```python
def compress_image_haar(image_path, output_path, threshold=0.3, quantization_step=30.0):
    # Image compression based on Haar transform
    r_channel, g_channel, b_channel, image_size = load_bmp_image(image_path)

    channels = [r_channel.flatten(), g_channel.flatten(), b_channel.flatten()]
    compressed_channels = []

    for channel in channels:
        # Pad length to power of 2
        channel_padded, orig_len = pad_to_pow2(channel)

        # Haar transform
        approxs, details = haar_decompose(
            np.array(channel_padded),
            int(np.log2(len(channel_padded)))
        )

        # Compress detail coefficients
        for level in range(len(details)):
            max_magnitude = np.max(np.abs(details[level]))
            details[level], _ = magnitude_threshold_filter(
                np.array(details[level]),
                max_magnitude * threshold
            )
            details[level] = quantize(
                np.array(details[level]),
                quantization_step
            )

        # Reconstruct signal
        reconstructed = haar_reconstruct(approxs, details)
        reconstructed = unpad(reconstructed, orig_len)
        compressed_channels.append(reconstructed)

    # Restore to 2D and save image
    r_compressed = np.array(compressed_channels[0][:np.prod(r_channel.shape)]).reshape(r_channel.shape)
    g_compressed = np.array(compressed_channels[1][:np.prod(g_channel.shape)]).reshape(g_channel.shape)
    b_compressed = np.array(compressed_channels[2][:np.prod(b_channel.shape)]).reshape(b_channel.shape)

    save_compressed_image(r_compressed, g_compressed, b_compressed, output_path)

# input_img = 'MANDRILL.BMP'
# output_img = 'haar.BMP'
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

![Image compression based on Haar transform](/images/projects/haar.png)

---

### Conclusion

- The Fourier transform compresses the image globally across the entire image.
- The Haar transform captures less important regions, such as backgrounds, and applies compression more selectively.
- This is because the Haar transform analyzes the image using the averages and differences between neighboring pixels.
