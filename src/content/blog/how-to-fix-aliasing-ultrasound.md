---
slug: how-to-fix-aliasing-ultrasound
title: How to Fix Aliasing on Ultrasound, in the Order You'd Actually Try It
metaTitle: How to Fix Aliasing on Ultrasound | SonoPass
description: How to fix aliasing on ultrasound: what it looks like in spectral and color Doppler, why it happens (Nyquist = PRF/2), and the fixes in a practical order.
keyword: how to fix aliasing ultrasound
date: 2026-11-19
readMinutes: 7
---
You're sampling a stenosis, and the peak of the spectral waveform gets chopped off at the top of the display and reappears coming up from the bottom. Or the color box over a tight carotid turns into a mosaic of red, blue and yellow. That's aliasing. It's one of the most common Doppler artifacts in the lab and one of the most reliably tested concepts on the SPI. The good news: it has one cause and a short list of fixes. Here's what it looks like, why it happens, and how to fix it in the order you'd actually reach for the knobs.

## What aliasing looks like

### Spectral Doppler

The peak velocities are too high to display in their true direction, so they **wrap around**. The top of the waveform gets cut off at the edge of the scale and shows up on the opposite side of the baseline. A forward-flowing artery looks like it has flow going both directions at peak systole. You can't measure a peak systolic velocity, because the peak isn't where it should be.

### Color Doppler

In color, aliasing shows up as a **sudden jump from the brightest shade of one color to the brightest shade of the other**: bright yellow straight into bright cyan, with no black band between them. That's the key difference from true flow reversal, where the color passes through **black (zero shift)** on the way from red to blue. In a jet or stenosis, the high-velocity area becomes a speckled red-blue mosaic.

## Why aliasing happens: the Nyquist limit

Pulsed-wave Doppler doesn't listen continuously. It samples the returning signal once per pulse. To measure a frequency correctly, you need at least two samples per cycle. So the highest Doppler shift a pulsed system can display correctly is:

**Nyquist limit = PRF / 2**

When the Doppler shift is higher than the Nyquist limit, the system undersamples it and shows the wrong direction and magnitude. It's the same reason wagon wheels seem to spin backward in old movies.

Two things push you over the limit:

1. **The Doppler shift is too high.** The shift is 2 × f0 × v × cos θ / c, so high velocity, high transmitted frequency or a small angle (near 0°) all raise it.
2. **The PRF is too low.** PRF is limited by depth: the system has to wait for echoes from the sample volume before sending the next pulse. Max PRF is about 77,000 / depth in cm, so deeper vessels get a lower ceiling.

Every fix below either **raises the Nyquist limit** or **lowers the Doppler shift**. If you remember that, you can reason out any SPI question on aliasing.

## How to fix aliasing: a practical order

### 1. Raise the scale (PRF)

This is the first move because it targets the cause directly. Turning up the velocity scale raises the PRF, which raises the Nyquist limit. In color, raising the scale also cleans up the mosaic so you can see where the highest-velocity jet really is.

**Limit:** you can't raise PRF past what the depth allows. Once the scale is maxed out, move on.

### 2. Lower (shift) the baseline

Moving the baseline down gives more of the display to flow in one direction. If all the flow goes forward, you can give it nearly the whole scale. This is often enough to unwrap a spectral waveform that's only slightly aliased.

**Important for the SPI:** shifting the baseline **does not change the Nyquist limit or the PRF**. It only rearranges the display. That's a common trick answer. It's a fix for how aliasing looks, not a change to the sampling.

### 3. Reduce the depth, or get closer

A shallower sample volume lets the system use a higher PRF. Reduce the image depth if you've left extra room below the vessel. Better yet, find a window where the vessel is closer to the transducer: a different approach, gentle pressure (when it won't distort the vessel), or a different probe position.

### 4. Use a lower transducer frequency

The Doppler shift is directly related to the transmitted frequency. Drop f0 from 5 MHz to 2.5 MHz and the shift for the same velocity halves. The system can display it under the same Nyquist limit. Lower frequency also helps penetration at depth, where aliasing is more likely anyway.

### 5. Increase the angle toward 60°

Because the shift depends on cos θ, increasing the angle between the beam and the flow lowers the shift. Going from 0° toward 60° cuts cos θ from 1 to 0.5, which halves the shift.

**Caveat:** don't go past 60° for velocity measurements. Errors in angle correction grow quickly at steep angles. Labs use angles of 60° or less for that reason. This fix lowers the shift, but it isn't permission to scan at 80°.

### 6. Switch to continuous-wave Doppler

CW Doppler transmits and receives continuously with separate crystals, so there's no sampling and **no Nyquist limit**. It won't alias at any velocity. That's why CW is the go-to for very high velocity jets, such as in valvular stenosis.

**Trade-off:** CW has **range ambiguity**. It picks up every moving reflector along the beam, so you can't tell exactly what depth the signal came from.

## Pitfalls to avoid

- **Don't confuse aliasing with flow reversal.** Aliasing jumps bright-to-bright with no black between. True reversal passes through black. In spectral, aliasing is the peak wrapping around, while reversal is a distinct flow component below the baseline.
- **Don't fix it by turning up the wall filter.** The wall filter removes low-frequency signals near the baseline. It does nothing for the high-frequency shifts that alias.
- **Don't treat baseline shift as a full fix for severe aliasing.** If the waveform still wraps after the baseline is at the bottom and the scale is at max, you need a real change: a shallower window, a lower frequency, or CW.
- **Don't change the angle without re-correcting.** If you change the beam-to-flow angle, update the angle correction or your velocity will be wrong.
- **Know when aliasing is useful.** In color, the aliased spot can point you to the highest-velocity area. That's where to put your spectral sample volume.

## How aliasing shows up on the SPI

Expect aliasing to appear in several forms:

1. **Recognition:** an image or description of a spectral waveform wrapped around the baseline, or a color mosaic, and you name the artifact.
2. **Cause:** "Aliasing occurs when the Doppler shift exceeds…" The answer is the Nyquist limit, which is PRF / 2.
3. **Calculation:** "The PRF is 6 kHz. Which Doppler shift will alias?" The Nyquist limit is 3 kHz, so any shift above 3 kHz.
4. **Fix selection:** "Which will NOT reduce aliasing?" Watch for **increasing transducer frequency**, **increasing depth**, **decreasing the scale** and **increasing the wall filter**. All of those either make it worse or don't help.
5. **Modality choice:** "Which Doppler mode never aliases?" Continuous wave.

A quick way to check any answer choice: does it raise PRF, or does it lower the Doppler shift? If neither, it's not a fix (baseline shift is the one display-only exception).

## Practice it until it's automatic

Aliasing sits at the center of the Doppler concepts area, one of the largest parts of the SPI under the September 2023 outline. It also overlaps with artifacts and image optimization. You'll want to answer these questions in under a minute.

SonoPass has **370+ SPI practice questions**, each with a **detailed explanation and a hint**, so a miss turns into a lesson instead of a guess. Use **Study Mode** to drill Doppler by itself, and try the **24-question SPI Artifact Drill** when you're ready to mix aliasing with the rest of the artifact list. Then take a **full-length SPI mock** (110 questions, 2 hours) to make sure it holds up under time pressure.

**[Download SonoPass](/#download)** and start with one free Quick 10 a day. For the rest of the math behind aliasing, see our guide to [SPI exam formulas](/blog/spi-exam-formulas), and for every other artifact, read [ultrasound artifacts for the SPI](/blog/ultrasound-artifacts-spi-exam).

<!-- FAQ -->
Q: What causes aliasing in ultrasound?
A: Aliasing happens in pulsed-wave Doppler when the Doppler shift is higher than the Nyquist limit, which is half the pulse repetition frequency (PRF / 2). The system samples too slowly to show the true velocity and direction.
Q: What is the first thing to do to fix aliasing?
A: Raise the velocity scale, which raises the PRF and the Nyquist limit. If the scale is already at its maximum, lower the baseline, reduce depth, use a lower transducer frequency, or switch to continuous-wave Doppler.
Q: Does moving the baseline change the Nyquist limit?
A: No. Shifting the baseline only reassigns more of the display to one flow direction. The PRF and the Nyquist limit stay the same.
Q: How can you tell aliasing from flow reversal on color Doppler?
A: Aliasing jumps directly from the brightest shade of one color to the brightest shade of the other. True flow reversal passes through a black band, which represents zero Doppler shift.
Q: Why doesn't continuous-wave Doppler alias?
A: CW Doppler transmits and receives continuously instead of sampling with pulses, so it has no Nyquist limit. The trade-off is range ambiguity: you can't tell exactly which depth the signal came from.
