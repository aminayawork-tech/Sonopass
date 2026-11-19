---
slug: spi-exam-formulas
title: SPI Formulas You Actually Need (and How to Use Them Without a Calculator)
metaTitle: SPI Exam Formulas You Actually Need | SonoPass
description: The SPI exam formulas that matter, grouped by topic, with what each term means, the direct or inverse relationship to memorize, and a worked example.
keyword: SPI exam formulas
date: 2026-11-19
readMinutes: 8
---
Most SPI exam formula questions don't ask you to grind through arithmetic. They ask what happens: if the frequency doubles, what does the wavelength do? If the depth goes from 8 cm to 16 cm, what happens to the frame rate? The SPI is a relationship exam. Learn each formula well enough to say "direct" or "inverse" in two seconds, and keep three shortcut numbers in your head (1.54, 13 and 77,000), and you can handle almost every math question with your note board and no calculator.

Below are the formulas worth knowing, grouped by topic. Each one has what the terms mean, the relationship to memorize, and one quick worked example.

## Sound basics

### Period and frequency

**Period = 1 / frequency**

- Period (T) is the time for one cycle. Frequency (f) is cycles per second.
- **Relationship:** inverse. Double the frequency, halve the period.
- **Example:** a 5 MHz transducer has a period of 1/5 = **0.2 µs**.

### Wavelength

**Wavelength (λ) = propagation speed (c) / frequency (f)**

- In soft tissue, c averages **1540 m/s**. That gives a shortcut: **λ (mm) = 1.54 / f (MHz)**.
- **Relationship:** wavelength is inversely related to frequency and directly related to propagation speed. Frequency is set by the transducer. Speed is set by the medium.
- **Example:** at 5 MHz in soft tissue, λ = 1.54 / 5 = **about 0.31 mm**.

### Acoustic impedance and reflection

**Impedance (Z) = density × propagation speed**, measured in rayls.

**Intensity reflection coefficient = ((Z2 − Z1) / (Z2 + Z1))²**

- A reflection needs an **impedance mismatch** (with perpendicular incidence). Same Z on both sides means no reflection.
- **Example:** Z1 = 1 and Z2 = 3 (any units). (2 / 4)² = 0.25, so **25%** of the intensity reflects and 75% transmits.

### Refraction (Snell's law)

**sin(transmitted angle) / sin(incident angle) = c2 / c1**

- Refraction needs **oblique incidence and different propagation speeds**. If medium 2 is faster, the transmitted angle is larger than the incident angle.

## Range equation and the 13-microsecond rule

**Distance to reflector = (c × go-return time) / 2**

- You divide by 2 because the pulse travels to the reflector and back.
- At 1540 m/s, sound takes **13 µs** to make the round trip for each **1 cm** of depth. That's the 13-microsecond rule.
- **Relationship:** depth and go-return time are directly related.
- **Example:** an echo returns 52 µs after the pulse left. 52 / 13 = **4 cm deep**.

The same number gives you the pulse repetition limit. One second divided by 13 µs is about **77,000**, so:

**Maximum PRF (Hz) ≈ 77,000 / depth (cm)**

- **Relationship:** depth and PRF are inversely related. Image deeper, and the system has to wait longer between pulses.
- **Example:** at 10 cm, max PRF ≈ **7,700 Hz**.

### Pulse parameters

- **Pulse repetition period = 1 / PRF.** Inverse.
- **Duty factor = pulse duration / pulse repetition period.** Continuous wave is 100% (1.0). Imaging pulses spend most of their time listening, so the duty factor is small.
- **Spatial pulse length (SPL) = number of cycles × wavelength.**
- **Pulse duration = number of cycles × period.**

## Resolution

### Axial resolution

**Axial resolution = SPL / 2**

- Smaller number = better resolution. Fewer cycles per pulse (more damping) or higher frequency (shorter wavelength) both shorten SPL.
- **Example:** a 2-cycle pulse with λ = 0.3 mm has SPL = 0.6 mm, so axial resolution = **0.3 mm**.

### Lateral resolution

**Lateral resolution ≈ beam width**

- It's best at the focus, where the beam is narrowest. Higher frequency and focusing improve it. There's no single-number formula to plug in on the exam; know that beam width sets it.

## Doppler

**Doppler shift = (2 × f0 × v × cos θ) / c**

- f0 is the transmitted frequency, v is the blood velocity, θ is the angle between the beam and the flow, and c is propagation speed.
- **Relationships:** the shift is directly related to f0, velocity and cos θ. It's inversely related to c.
- **The cosines you need:** cos 0° = 1, cos 60° = 0.5, cos 90° = 0. At 90° the system measures **no shift**, even though blood is moving.
- **Example:** f0 = 2 MHz, v = 0.77 m/s, θ = 0°. 2 × 2,000,000 × 0.77 / 1540 = **2,000 Hz**. Change the angle to 60° and the shift halves to **1,000 Hz**.

Rearranged, the system calculates velocity from the shift: **v = (Doppler shift × c) / (2 × f0 × cos θ)**. That's why a bad angle correction gives a bad velocity. The error gets larger at steep angles, which is why labs keep the angle at 60° or less.

## Nyquist limit and aliasing

**Nyquist limit = PRF / 2**

- The Nyquist limit is the highest Doppler shift pulsed Doppler can display without aliasing.
- **Relationship:** Nyquist is directly related to PRF. Since max PRF falls as depth increases, deep vessels alias more easily.
- **Example:** at 10 cm, max PRF ≈ 7,700 Hz, so Nyquist ≈ **3,850 Hz**. A 4,500 Hz shift will alias.

Continuous-wave Doppler has no Nyquist limit, so it doesn't alias. The trade-off is range ambiguity. For the full set of fixes, read [how to fix aliasing on ultrasound](/blog/how-to-fix-aliasing-ultrasound).

## Decibels, intensity and attenuation

### Intensity, power and amplitude

- **Intensity = power / beam area.** Direct with power, inverse with area. Focusing raises intensity by shrinking the area.
- **Power ∝ amplitude²** and **intensity ∝ amplitude²**. Double the amplitude and you get **4×** the power and intensity.

### Decibel rules

Decibels are logarithmic, so you add dB and multiply the intensity:

- **+3 dB = ×2 intensity**
- **+10 dB = ×10 intensity**
- **−3 dB = half the intensity. −10 dB = one-tenth.**

**Examples:**
- +6 dB = 3 + 3 = ×2 × 2 = **×4**
- +9 dB = **×8**
- +20 dB = 10 + 10 = **×100**
- −6 dB = **one-quarter** of the original intensity

### Attenuation

**Attenuation (dB) ≈ 0.5 dB/cm/MHz × frequency (MHz) × path length (cm)**

- In soft tissue, the attenuation coefficient is about **0.5 dB/cm per MHz**.
- **Relationship:** attenuation is directly related to both frequency and distance. That's the core trade-off: higher frequency gives better resolution but less penetration.
- **Example:** at 5 MHz to a depth of 4 cm, one-way attenuation ≈ 0.5 × 5 × 4 = **10 dB**, so the intensity is one-tenth. The round trip is 20 dB, or one-hundredth.

### Half-value layer

The half-value layer (HVL) is the depth where intensity falls by half, which is a **3 dB** loss. In soft tissue, that works out to about **6 / f (MHz) cm**. Higher frequency means a thinner half-value layer.

## Frame rate and temporal resolution

**Time per frame = lines per frame × depth (cm) × 13 µs**

**Frame rate ≈ 77,000 / (depth in cm × lines per frame)** (with one focal zone)

- **Relationships:** frame rate is inversely related to depth, line density, number of focal zones and sector width. A higher frame rate means better temporal resolution.
- **Example:** 10 cm deep with 100 lines per frame: 77,000 / 1,000 = **77 frames per second**. Double the depth to 20 cm and the frame rate drops to about **38**.

Every extra focal zone adds another pulse down each line, which slows the frame rate. That's why "add focal zones" and "improve temporal resolution" pull in opposite directions.

## Relationship cheat table

Copy this onto your note board in the first minute of the exam.

| If this goes up… | This… | Why |
|---|---|---|
| Frequency | Wavelength goes **down** | λ = c / f |
| Frequency | Period goes **down** | T = 1 / f |
| Frequency | Attenuation goes **up**, penetration goes **down** | 0.5 dB/cm/MHz |
| Frequency | Axial and lateral resolution **improve** | Shorter SPL, narrower beam |
| Frequency (f0) | Doppler shift goes **up** | Shift ∝ f0 |
| Depth | Max PRF goes **down** | PRF ≈ 77,000 / depth |
| Depth | Frame rate goes **down** | More time per line |
| Depth | Nyquist limit goes **down** | Nyquist = PRF / 2 |
| PRF | Nyquist limit goes **up**, aliasing goes **down** | Nyquist = PRF / 2 |
| Angle (toward 90°) | Doppler shift goes **down** | cos θ shrinks |
| Velocity | Doppler shift goes **up** | Shift ∝ v |
| Cycles per pulse | SPL goes **up**, axial resolution **worsens** | SPL = cycles × λ |
| Focal zones or line density | Frame rate goes **down** | More pulses per frame |
| Amplitude (×2) | Intensity and power go **×4** | ∝ amplitude² |
| Beam area | Intensity goes **down** | Intensity = power / area |
| Propagation speed | Wavelength goes **up** | λ = c / f |

## How to practice formulas so they stick

Reading this page once won't make the relationships stick. Answering questions will. Write the table from memory each morning for a week, re-solve the examples above using only 1.54, 13 and 77,000, and do mixed question sets, because the exam won't tell you which formula a question is about.

SonoPass has **370+ SPI practice questions**, each with a **detailed explanation and a hint**. Use **Study Mode** to drill one category, run a **Quick 10** (about 5 minutes) between classes, and review the **SPI flashcard study guide** for quick recall. When your relationships are solid, take one of the **3 full-length SPI mocks** (110 questions, 2 hours) to practice under real timing.

**[Start free](/#download)** with one Quick 10 a day, or go Pro for all 9 registries at $9.99/month or $49.99 one-time for Pro Lifetime (launch price). For the big-picture study plan, read [how to pass the ARDMS SPI exam on your first try](/blog/how-to-pass-ardms-spi-exam-first-try).

<!-- FAQ -->
Q: Do I need a calculator for the SPI exam?
A: Most SPI math questions test relationships, like what happens to wavelength when frequency doubles. Shortcuts such as λ (mm) = 1.54 / f (MHz), the 13-microsecond rule and 77,000 / depth let you solve the rest by hand on your note board.
Q: What is the 13-microsecond rule?
A: In soft tissue, at 1540 m/s, sound takes 13 microseconds to travel to a reflector 1 cm deep and back. So an echo that returns after 26 µs came from 2 cm deep.
Q: What is the Doppler equation on the SPI?
A: Doppler shift = (2 × f0 × v × cos θ) / c. The shift rises with transmitted frequency, blood velocity and cos θ, and falls to zero when the beam is at 90° to the flow.
Q: How do decibels work on the SPI?
A: Decibels add while intensity multiplies. Every 3 dB doubles the intensity and every 10 dB multiplies it by 10, so 6 dB is 4× and 20 dB is 100×. Negative values work the same way in reverse.
Q: Which SPI formulas are most important?
A: Focus on the ones that drive Doppler and image optimization: wavelength, the range equation, the Doppler equation, Nyquist limit, attenuation, axial resolution and frame rate. Check the official SPI content outline on ardms.org for current topic coverage.
