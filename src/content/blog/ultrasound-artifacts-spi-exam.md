---
slug: ultrasound-artifacts-spi-exam
title: Ultrasound Artifacts on the SPI, One by One (What You See, Why, and the Fix)
metaTitle: Ultrasound Artifacts for the SPI Exam | SonoPass
description: Ultrasound artifacts for the SPI, one by one: what each looks like, which imaging assumption it breaks, and and how to fix or confirm it on the scanner.
keyword: ultrasound artifacts SPI
date: 2026-11-19
readMinutes: 8
---
Every ultrasound artifact comes from the machine believing something that isn't true. The system assumes sound travels in a straight line, at 1540 m/s, and reflects only once. It assumes every echo comes from the center of a thin beam, and that attenuation is the same everywhere. Break one of those assumptions and you get an echo in the wrong place, the wrong brightness, or something that isn't there at all. Learn which assumption each artifact breaks, and SPI artifact questions stop being memorization and start being logic.

Here's every artifact you need for the SPI, in the same format: what you see, why it happens, and how to fix or confirm it.

## The assumptions behind every image

Keep this list on your note board. Nearly every artifact traces back to one of these:

1. Sound travels in a **straight line**.
2. Sound travels at **1540 m/s** in all soft tissue.
3. Each echo comes from a reflector **on the beam's central axis**.
4. The beam is **infinitely thin** (in both lateral and elevational planes).
5. Sound reflects **once** and goes straight back to the transducer.
6. Attenuation is **uniform** through the tissue.
7. Each echo comes from the **most recent pulse**.

## Reverberation

**What you see:** multiple evenly spaced, parallel lines, getting weaker with depth. They often look like ladder rungs behind the anterior wall of the bladder or gallbladder.

**Why:** assumption 5. Sound bounces back and forth between two strong, parallel reflectors (or between a reflector and the transducer face). Each extra round trip takes more time, so the system places each copy deeper.

**Fix or confirm:** change the angle of insonation, use harmonic imaging, or adjust the near-field gain or TGC. The spacing between lines matches the distance between the two reflectors.

## Comet tail and ring-down

These are both reverberation-type artifacts, but they look different and have different causes.

### Comet tail

**What you see:** a short, bright, tapering streak behind a small, strong reflector, such as a surgical clip, a needle, or cholesterol crystals in the gallbladder wall.

**Why:** assumption 5. The reverberations are so closely spaced that the separate lines merge into one solid streak.

### Ring-down

**What you see:** a long, continuous bright line streaming down from a gas collection, such as bowel gas.

**Why:** fluid trapped between gas bubbles resonates and keeps emitting sound. This is a resonance phenomenon, not simple back-and-forth bouncing between two surfaces.

**Fix or confirm:** both can be useful. Comet tail helps identify metal and crystals. Ring-down helps identify gas. Change the angle to confirm.

## Mirror image

**What you see:** a duplicate of a real structure on the **far side of a strong reflector**. The copy is the same distance behind the reflector as the real one is in front of it. The classic example is the liver appearing above the diaphragm.

**Why:** assumptions 1 and 5. The strong reflector bounces the beam off to the real structure and back. The system assumes a straight path, so it plots the extra travel time as a deeper echo along the original beam line.

**Fix or confirm:** change the angle or window. The **real structure is always the one closer to the transducer**. The mirror image is always deeper. Mirror images can occur in Doppler too, for example a duplicated subclavian artery.

## Refraction and edge shadowing

### Refraction

**What you see:** a structure displaced sideways, or a side-by-side duplication. A common example is a doubled image of a deep structure seen through the rectus abdominis muscles.

**Why:** assumptions 1 and 3. Sound bends at a boundary between tissues with **different propagation speeds** when it strikes at an oblique angle (Snell's law). The system assumes the beam went straight, so it places the echo off to the side.

**Fix or confirm:** change your window so the beam hits the boundary closer to perpendicular.

### Edge shadowing

**What you see:** thin dark lines extending down from the edges of a curved structure, such as a cyst or the fetal skull.

**Why:** refraction and reflection at the curved edge bend the beam away. Less sound reaches the tissue directly behind the edges.

**Fix or confirm:** change your angle. Don't mistake it for shadowing from a stone or calcification.

## Acoustic shadowing

**What you see:** a dark band behind a strongly attenuating structure, such as a gallstone, a kidney stone, bone or calcified plaque.

**Why:** assumption 6. The structure absorbs or reflects so much sound that little reaches the tissue behind it, but the TGC compensates as if attenuation were normal.

**Fix or confirm:** shadowing is often **diagnostically useful**: a clean shadow helps confirm a stone. Bowel gas gives a "dirty" shadow with low-level echoes in it. Harmonics and placing the focus at the level of the structure tend to make a shadow sharper. Spatial compounding tends to reduce shadowing, so turn it off if you need to see one.

## Posterior enhancement

**What you see:** a brighter band behind a structure that attenuates less than the surrounding tissue, such as a simple cyst, the gallbladder or the bladder.

**Why:** assumption 6, the opposite of shadowing. The TGC adds gain for attenuation that didn't happen inside the fluid, so the tissue behind looks too bright.

**Fix or confirm:** also **diagnostically useful**. It helps suggest a fluid-filled structure. Adjust TGC if it's obscuring deeper anatomy.

## Side lobes and grating lobes

**What you see:** echoes in places where there shouldn't be any, often low-level echoes inside an anechoic structure (like a gallbladder or bladder) near a strong reflector. They can mimic sludge or debris.

**Why:** assumption 3. Real transducers send some energy off-axis. **Side lobes** come from single-element and array transducers. **Grating lobes** come from the regular spacing of elements in arrays. A strong reflector hit by these off-axis beams gets displayed as if it were on the main axis.

**Fix or confirm:** harmonic imaging reduces both. For grating lobes, manufacturers use **subdicing** and **apodization**. On the scanner, change the angle and see if the echoes move or disappear.

## Slice thickness (elevational) artifact

**What you see:** low-level echoes filling in an anechoic structure, such as a cyst or the bladder, that can look like debris.

**Why:** assumption 4. The beam has thickness in the elevational plane (the third dimension). Echoes from tissue just outside the scan plane get averaged into the image.

**Fix or confirm:** place the focus at the depth of interest. 1.5-D and 2-D (matrix) array transducers can focus in the elevational plane, which reduces this artifact. Scanning in a second plane helps confirm it.

## Speed error (propagation speed artifact)

**What you see:** a structure at the wrong depth, or a "step-off" in a straight boundary, such as a diaphragm or needle that appears broken.

**Why:** assumption 2. If sound travels **slower** than 1540 m/s, echoes come back late and the structure is placed **too deep**. If sound travels **faster**, the structure is placed **too shallow**. Fat, which is slower than average soft tissue, is a classic cause.

**Fix or confirm:** change the window to avoid the tissue causing the error. This is the one to remember for SPI questions that ask what happens when the speed is lower than assumed.

## Range ambiguity

**What you see:** echoes placed too shallow, sometimes appearing inside a structure where they don't belong.

**Why:** assumption 7. With a high PRF, an echo from a deep reflector returns **after the next pulse has been sent**. The system thinks it belongs to the new pulse and places it too close to the transducer.

**Fix or confirm:** lower the PRF, usually by increasing the imaging depth so the system waits longer between pulses.

## Aliasing

**What you see:** in spectral Doppler, the peak wraps around to the other side of the baseline. In color, a mosaic jumps from bright red-yellow to bright blue-cyan with no black in between.

**Why:** the Doppler shift is higher than the Nyquist limit (PRF / 2).

**Fix or confirm:** raise the scale, lower the baseline, reduce depth, use a lower frequency, increase the angle (staying at or under 60°), or switch to CW. The full walk-through is in [how to fix aliasing on ultrasound](/blog/how-to-fix-aliasing-ultrasound).

## Quick reference table

| Artifact | Looks like | Assumption violated | Placed where? |
|---|---|---|---|
| Reverberation | Evenly spaced parallel lines | Single reflection | Too deep (copies) |
| Comet tail | Short tapering bright streak | Single reflection | Behind reflector |
| Ring-down | Long continuous streak from gas | Single reflection (resonance) | Behind gas |
| Mirror image | Copy behind strong reflector | Straight line, single reflection | Too deep |
| Refraction | Sideways shift or duplication | Straight line | Wrong lateral position |
| Shadowing | Dark band | Uniform attenuation | Behind attenuator |
| Enhancement | Bright band | Uniform attenuation | Behind low attenuator |
| Side / grating lobe | Off-axis echoes in fluid | Echo is on the main axis | Wrong lateral position |
| Slice thickness | Low-level echoes in cyst | Thin beam | Within the slice |
| Speed error | Wrong depth, step-off | 1540 m/s | Too deep (slow) or too shallow (fast) |
| Range ambiguity | Echoes too shallow | Echo from latest pulse | Too shallow |
| Aliasing | Wraparound or mosaic | Shift under Nyquist | Wrong direction |

## How artifacts show up on the SPI

SPI artifact questions usually ask you to **name it** from an image or description, **explain it** (which assumption broke), **fix it** (which control reduces it), or **use it** (which artifacts help with diagnosis).

## Drill artifacts the way they're tested

SonoPass includes a **24-question SPI Artifact Drill**, built to practice exactly this: seeing an artifact, naming it and choosing the fix. Every question comes with a **detailed explanation and a hint**. Once you're consistent, go broader with the **370+ SPI practice questions** in Study Mode and finish with a full-length mock (110 questions, 2 hours).

**[Start free](/#download)** with one Quick 10 a day. Pro unlocks all 9 registries in one plan for $9.99/month or $49.99 one-time (Pro Lifetime, launch price). Want the math behind these artifacts? See [SPI exam formulas](/blog/spi-exam-formulas).

<!-- FAQ -->
Q: What ultrasound artifacts are on the SPI exam?
A: Expect reverberation, comet tail, ring-down, mirror image, refraction and edge shadowing, acoustic shadowing, posterior enhancement, side and grating lobes, slice thickness, speed error, range ambiguity and aliasing. Check the official SPI content outline on ardms.org for current coverage.
Q: Which is the real structure in a mirror image artifact?
A: The real structure is the one closer to the transducer. The mirror copy appears deeper, on the far side of the strong reflector, at the same distance behind it as the real structure is in front.
Q: What happens if sound travels slower than 1540 m/s?
A: The echoes return later than the system expects, so the structure is displayed too deep. If sound travels faster than 1540 m/s, the structure is displayed too shallow.
Q: Which ultrasound artifacts are helpful for diagnosis?
A: Acoustic shadowing helps identify stones and calcifications, posterior enhancement suggests fluid, comet tail can point to metal or cholesterol crystals, and ring-down suggests gas.
Q: How do you fix range ambiguity?
A: Lower the PRF, usually by increasing the imaging depth. That gives deep echoes time to return before the next pulse is sent.
Q: What is the difference between side lobes and grating lobes?
A: Both are off-axis beams that place echoes in the wrong lateral position. Side lobes occur with single-element and array transducers, while grating lobes come from the regular spacing of elements in arrays. Harmonics reduce both, and subdicing and apodization reduce grating lobes.
