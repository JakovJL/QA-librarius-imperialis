# 12 Mobile App Testing

## Table of Contents

- [[#What Is Mobile App Testing]]
- [[#Types of Mobile Apps]]
- [[#Simulators vs Emulators]]
- [[#iOS vs Android]]
- [[#Device Selection]]
- [[#Testing Strategies]]
- [[#Tools]]
- [[#Interview Questions]]
	- [[#Top 10]]
	- [[#Tricky Questions]]

**Related notes:** [[QA manual eng]]

---

## What Is Mobile App Testing

Mobile app testing verifies that a mobile application works correctly across different devices, operating systems, screen sizes, and network conditions. It covers functionality, usability, performance, compatibility, and security specific to the mobile context.

**Goal:** Confirm that the app behaves correctly for the target audience on their real devices and usage conditions.

**Mobile-specific challenges:**
- Huge variety of devices, screen sizes, and OS versions
- Interruptions — calls, notifications, battery warnings
- Network instability — switching between Wi-Fi, 4G, offline
- Limited device resources (memory, battery, CPU)
- Different input methods (touch, swipe, gestures, voice)
- Frequent OS updates from Apple and Google

---

## Types of Mobile Apps

### Native Apps

Built specifically for one platform using the platform's native language and tools.

- **iOS:** Swift or Objective-C, Xcode
- **Android:** Kotlin or Java, Android Studio

**Advantages:**
- Best performance and user experience
- Full access to device hardware (camera, GPS, sensors)
- Follows platform UI/UX guidelines natively

**Disadvantages:**
- Separate codebase for iOS and Android
- Higher development and maintenance cost

**Example:** Instagram, Spotify native apps

---

### Hybrid Apps

Web apps wrapped inside a native container using frameworks like React Native, Ionic, or Flutter.

**Advantages:**
- One codebase for both platforms
- Faster development and lower cost
- Can access some device hardware

**Disadvantages:**
- Performance is generally lower than native
- Some platform-specific UI differences may appear
- Limited access to the newest device features

**Example:** Many banking and enterprise apps

---

### Mobile Web Apps

Regular websites accessed through a mobile browser — no installation required.

**Advantages:**
- No installation, always up to date
- Works on any device with a browser

**Disadvantages:**
- Very limited access to device hardware
- No offline capability without special setup
- Browser chrome takes screen space

> [!tip] Types of Mobile Apps
> | | Native | Hybrid | Mobile Web |
> |---|---|---|---|
> | **Language** | Swift / Kotlin | JS (React Native, Flutter) | HTML/CSS/JS |
> | **Install required?** | Yes | Yes | No |
> | **Device hardware access** | Full | Partial | Minimal |
> | **Performance** | Best | Medium | Variable |
> | **Codebase** | Per platform | Shared | Shared |

---

## Simulators vs Emulators

### Simulator

A **simulator** mimics the **software behavior** of a device but does not replicate the actual hardware. It runs on the host machine using the host's CPU.

- **iOS Simulator** — included with Xcode, runs on macOS only
- Simulates device screen size, resolution, and iOS behavior
- Cannot simulate hardware sensors (real GPS, accelerometer, Bluetooth), phone calls, or low-memory conditions accurately

### Emulator

An **emulator** replicates both the **hardware and software** of a target device. It emulates the processor and hardware, making it more accurate but slower.

- **Android Emulator** (AVD — Android Virtual Device) — included with Android Studio
- Supports GPS simulation, battery controls, network speed throttling
- Can simulate incoming calls and SMS

> [!tip] Simulator vs Emulator
> | | Simulator | Emulator |
> |---|---|---|
> | **Replicates** | Software behavior only | Hardware + software |
> | **Speed** | Faster | Slower |
> | **Accuracy** | Lower (hardware not replicated) | Higher |
> | **Hardware simulation** | Limited | Yes (GPS, battery, calls) |
> | **Platform** | iOS (macOS only) | Android (any OS) |
> | **Cost** | Free (with Xcode) | Free (with Android Studio) |

**When to use real devices:** For performance testing, battery drain testing, hardware-specific features (NFC, biometrics), and final verification before release.

---

## iOS vs Android

| | iOS | Android |
|---|---|---|
| **Developer** | Apple | Google |
| **Language (native)** | Swift, Objective-C | Kotlin, Java |
| **Fragmentation** | Low — limited device/OS combinations | High — many manufacturers, OS versions, screen sizes |
| **OS update rollout** | Fast — most users update within weeks | Slow — depends on manufacturer and carrier |
| **App distribution** | App Store only | Google Play + sideloading |
| **Permissions model** | Request at runtime, strict | Request at runtime, more flexible |
| **Screen sizes** | Limited, predictable | Wide variety |
| **Testing priority** | Test both — iOS and Android have different user bases depending on region |

**QA implications:**
- **Android fragmentation** means bugs can appear on specific device/OS combinations that do not reproduce on others
- **iOS updates** arrive faster — plan regression cycles around Apple's release schedule
- **Gestures** differ — iOS uses swipe-from-edge for navigation; Android has a back button (hardware or virtual)

---

## Device Selection

Testing on all possible devices is not feasible. Choose a representative subset using these criteria:

**Market share data**
Use analytics for your specific app (if available) or public market data to identify the most-used devices and OS versions in your target audience's region.

**OS version coverage**
- Cover the current version and the two previous major versions
- Users are slower to update on Android — check the fragmentation data

**Screen sizes**
- Small phone (< 5.5")
- Standard phone (5.5" – 6.5")
- Large phone / phablet (> 6.5")
- Tablet (if applicable)

**Hardware tier**
Test on both high-end and low-end devices — performance issues often appear only on older or budget hardware.

---

## Testing Strategies

### Real Device Testing

Testing on physical hardware owned by the QA team or provided by the client.

**Advantages:**
- Highest accuracy — real sensors, real performance
- Detects hardware-specific issues

**Disadvantages:**
- Expensive to maintain a device lab
- Limited to the devices you own

### Cloud Device Farms

Access to hundreds of real devices via a web interface. Devices are hosted remotely.

**Examples:** BrowserStack, Sauce Labs, AWS Device Farm, Firebase Test Lab

**Advantages:**
- Large device coverage without owning hardware
- Supports both manual and automated testing

**Disadvantages:**
- Cost scales with usage
- Slight latency during manual sessions

### Emulator / Simulator Testing

Used early in development for fast feedback loops.

**Advantages:**
- Free, fast to set up
- Good for functional testing of core flows

**Disadvantages:**
- Does not replicate real hardware behavior
- Performance and sensor tests are unreliable

---

## Tools

| Tool | Type | Platform | Notes |
|---|---|---|---|
| **Appium** | Automation framework | iOS + Android | Open source, supports multiple languages |
| **XCTest / XCUITest** | Automation framework | iOS only | Apple's native testing framework |
| **Espresso** | Automation framework | Android only | Google's native UI testing framework |
| **Detox** | Automation framework | iOS + Android | Gray-box testing for React Native apps |
| **BrowserStack** | Cloud device farm | iOS + Android | Real devices, supports Appium |
| **Sauce Labs** | Cloud device farm | iOS + Android | Real + virtual devices |
| **Firebase Test Lab** | Cloud device farm | Android (+ iOS) | Google's cloud testing service |
| **Charles Proxy** | Network proxy | iOS + Android | Intercept and inspect mobile network traffic |
| **Android Studio (AVD)** | Emulator | Android | Official Android emulator |
| **Xcode (Simulator)** | Simulator | iOS | macOS only |

---

## Interview Questions

### Top 10

**1. What is mobile app testing?**
Mobile app testing verifies that a mobile application works correctly across different devices, operating systems, screen sizes, and network conditions. It covers functionality, usability, performance, compatibility, and security in the mobile context.

**2. What are the three types of mobile apps?**
Native (built for one platform with its native language — Swift/Kotlin), hybrid (web code wrapped in a native container using React Native, Flutter, etc.), and mobile web (a website opened in the phone's browser, no installation).

**3. What is the difference between a simulator and an emulator?**
A simulator mimics only the software behavior of a device (iOS Simulator). An emulator replicates both hardware and software (Android Emulator), so it is more accurate but slower and can simulate GPS, battery, and calls.

**4. When should you test on real devices instead of emulators?**
For performance, battery drain, hardware-specific features (NFC, biometrics, camera), and final verification before release. Emulators are fine for early functional checks but do not reproduce real hardware behavior.

**5. How do you select which devices to test on?**
By market-share data for the target audience, OS-version coverage (current plus two previous), a range of screen sizes, and both high-end and low-end hardware tiers. Testing every device is not feasible, so you pick a representative subset.

**6. Why is Android more challenging to test than iOS?**
Android has high fragmentation — many manufacturers, OS versions, and screen sizes — so bugs can appear on specific device/OS combinations. iOS has fewer combinations and faster, more uniform OS update adoption.

**7. What are some mobile-specific things to test that desktop does not have?**
Interruptions (calls, notifications, low battery), network switching (Wi-Fi to 4G to offline), different gestures, screen rotation, limited resources (memory, battery), and app behavior on install/update/uninstall.

**8. What are the main testing strategies for mobile?**
Real device testing (most accurate, expensive), cloud device farms like BrowserStack or Firebase Test Lab (wide coverage without owning hardware), and emulator/simulator testing (fast, free, early-stage).

**9. Name some common mobile automation tools.**
Appium (cross-platform), XCTest/XCUITest (iOS), Espresso (Android), Detox (React Native). Cloud farms like BrowserStack and Sauce Labs support running them on many devices.

**10. What is a cloud device farm and why use one?**
A cloud device farm gives access to hundreds of real devices via a web interface. It provides wide device coverage without buying and maintaining hardware, and supports both manual and automated testing.

---

### Tricky Questions

**1. The app works on the emulator but fails on a real phone. Why might that be?**
Emulators do not replicate real hardware, sensors, performance, or network behavior. The real device may have less memory, a slower CPU, a different OS build, or hardware features the emulator only simulates. This is exactly why final testing needs real devices.

**2. A bug appears on one user's phone but you cannot reproduce it. What is the likely cause?**
Android fragmentation — the bug may be specific to that device model, OS version, or manufacturer customization. Reproducing it needs the same (or a very similar) device/OS combination, often via a cloud device farm.

**3. Is testing a mobile web app the same as testing a native app?**
No. A mobile web app runs in the browser with limited hardware access and no install flow, so testing focuses on responsive layout and browser compatibility. A native app needs testing of install/update, permissions, hardware features, and interruptions.

**4. Why is an interruption test important on mobile?**
Because phones constantly interrupt apps — incoming calls, notifications, alarms, low-battery warnings. The app must pause, keep its state, and resume correctly. Desktop apps rarely face this, so it is easy to forget.

**5. You have time to test on only two devices. How do you choose?**
Pick based on the audience: usually one widely-used Android device and one common iPhone, covering the most popular OS versions and a difference in screen size. Use market-share data to justify the choice rather than guessing.
