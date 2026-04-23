---
title: "Intel x86-64 아키텍쳐 레지스터 정보 정리"
date: "2026-03-25"
tags: ["정리", "번역", "x86-64", "Intel"]
lang: "ko"
author: ["권도한"]
description: "Intel 공식 문서를 기반으로 4비트 모드(64-bit mode)에서 볼 수 있는 레지스터를 번역하여 정리"
---

바라보는 관점에 따라 `x86-64`의 레지스터 개수에 대해 말하는 바가 매번 달라져, Intel의 공식 문서인 [`Intel® 64 and IA-32 Architectures Software Developer’s Manual Combined Volumes: 1, 2A, 2B, 2C, 2D, 3A, 3B, 3C, 3D, and 4`](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)에 설명되어 있는 64비트 모드(64-bit mode)에서 볼 수 있는 레지스터를 번역하여 정리하여 봄. 5329p의 전체 문서에서 "register" 검색 결과로 뜨는 대부분의 레지스터에 관해 정리하였음.

## 범용 레지스터 General Purpose Registers (Vol.1 p.3-13)

| 이름     | 용도                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RAX      | 산술 연산 시, 피연산자와 결과의 누산기로 사용                                                                                                                                               |
| RBX      | 접근할 데이터가 위치한 세그먼트 상의 주소를 가르킴 (Offset; 8086 Real Mode에서의 메모리 관리 방식과 연관 Segment(기본적으로 DS, Override 가능) + Offset(BX))                                |
| RCX      | 반복 횟수를 저장함 (REP 명령 시 CX가 0이 될 떄 까지 반복)                                                                                                                                   |
| RDX      | I/O 포트 번호를 저장함                                                                                                                                                                      |
| RDI      | 세그먼트 상의 데이터 주소를 가르키며 특히 String 명령에서의 목적지 주소와 관계됨 (Offset; 8086 Real Mode에서의 메모리 관리 방식과 연관 Segment(ES, Override 불가능) + Offset(DI)))          |
| RSI      | 세그먼트 상의 데이터 주소를 가르키며 특히 String 명령에서의 출발지 주소와 관계됨 (Offset; 8086 Real Mode에서의 메모리 관리 방식과 연관 Segment(기본적으로 DS, Override 가능) + Offset(SI))) |
| RBP      | 스택 세그먼트(SS) 안에서 현재 스택 프레임의 Base를 가르킴                                                                                                                                   |
| RSP      | 스택 세그먼트(SS) 안에서 현재 스택 프레임의 Top을 가르킴                                                                                                                                    |
| R8 - R15 | x86-64에서 추가된 범용 레지스터로 다양한 용도와 크기로 활용 가능                                                                                                                            |

## 세그먼트 레지스터 Segment Registers (Vol.1 p.3-15)

| 이름 | 용도                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------- |
| CS   | 현재 코드 영역을 가르킴 (MOV로 변경 불가능하며, JMP 혹은 인터럽트 관련 명령으로만 변경 가능)    |
| DS   | 데이터 영역을 가르킴 (String 관련 명령 시 기본 데이터 영역이며 Override가 가능 함)              |
| SS   | 스택 영역을 가르킴                                                                              |
| ES   | String 관련 명령 시 목적지와 관련된 데이터 영역을 가르킴 (Override 할 수 없음)                  |
| FS   | 추가적인 데이터 영역을 가르키는 레지스터로 64비트 모드에서는 운영체제 설계에 따라 다양하게 활용 |
| GS   | 추가적인 데이터 영역을 가르키는 레지스터로 64비트 모드에서는 운영체제 설계에 따라 다양하게 활용 |

## 플래그 레지스터 FLAGS Register (Vol.1 p.3-18)

| 이름   | 용도                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| RFLAGS | 보호모드에서 EFLAGS 레지스터에 +32bits를 추가한 레지스터로, 하위 32Bits 만을 사용함 (상위 32Bits 예약되어 있음) |

## 명령어 포인터 레지스터 Instruction Pointer Register (Vol.1 p.3-18)

| 이름 | 용도                             |
| ---- | -------------------------------- |
| RIP  | 다음 실행할 명령어의 주소를 저장 |

## 컨트롤 레지스터 Control Registers (Vol.3A p.2-13 / Vol.3A p.2-22)

| 이름 | 용도                                                                                                     |
| ---- | -------------------------------------------------------------------------------------------------------- |
| CR0  | 운영모드를 제어함                                                                                        |
| CR1  | 예약됨                                                                                                   |
| CR2  | Page-Fault 발생 시 발생한 선형 주소가 저장됨                                                             |
| CR3  | Page Directory의 실제 물리 주소가 저정되며, 페이징 케시 관련 플레그가 존재                               |
| CR4  | 프로세서가 지원하는 각종 확장 기능을 제어함                                                              |
| CR8  | 64비트 모드(IA-32e)에서만 접근 가능하며, APIC의 TPR(Task Priority Register) 값을 제어함                  |
| XCR0 | Context switch 시, 상태를 복원을 메모리의 범위를 지정함 (OS가 명령 > CPU가 XCR0을 보고 스스로 복원 수행) |

## 디스크립터 테이블 레지스터 Descriptor Table Registers (Vol.3A p.2-12)

| 이름               | 용도                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| GDTR               | Global Descriptor Table(세그먼트 디스크립터들의 집합으로, 코드/데이터/시스템 세그먼트의 속성 및 권한 정보를 정의)의 주소를 지정            |
| LDTR               | Local Descriptor Table(특정 태스크나 프로세스에 종속된 세그먼트 디스크립터 집합으로, 선택적으로 별도의 세그먼트 환경을 제공)의 주소를 지정 |
| IDTR               | Interrupt Descriptor Table(인터럽트 및 예외 발생 시 실행할 핸들러의 주소와 속성 정보를 담은 디스크립터 테이블)의 주소를 지정               |
| TR (Task Register) | Task State Segment(유저-커널 메모리 범위 간 이동 및 복귀 시 사용하는 세그먼트)의 주소를 지정                                               |

## 디버그 레지스터 Debug Registers (Vol.3B p.20-4 / Vol.3B p.20-42)

| 이름      | 용도                             |
| --------- | -------------------------------- |
| DR0 - DR3 | 브레이크포인터를 저장함          |
| DR4 - DR5 | 예약됨                           |
| DR6       | 현재 디버거의 현재 상태를 표현함 |
| DR7       | 현재 디버거의 설정을 저장함      |
| DR7       | 현재 디버거의 설정을 저장함      |

## MSR 레지스터 Model-Specific Registers (Vol.4 p.2-4)

| 이름                                      | 용도                                                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IA32_EFER                                 | Extended Feature Enables: 64비트(IA-32e) 모드 활성화, SYSCALL/SYSRET 명령어 지원 활성화, NX 플래그(메모리 실행 방지) 설정 등 64비트 운영의 핵심 스위치 역할 |
| IA32_STAR                                 | 32비트 호환성 모드에서 시스템 콜(SYSCALL) 호출 시 사용할 타겟 주소와 세그먼트 정보 지정                                                                     |
| IA32_LSTAR                                | 64비트 모드 시스템 콜 타겟 주소: 64비트 환경에서 SYSCALL 실행 시 진입할 커널 핸들러(Target RIP) 주소 저장                                                   |
| IA32_FMASK                                | 시스템 콜 진입 시 RFLAGS 레지스터에서 마스킹(초기화)할 플래그 값 지정 (인터럽트 비활성화 등 용도)                                                           |
| IA32_FS_BASE                              | 64비트 모드에서 FS 세그먼트 기본(Base) 주소 저장 (주로 스레드 로컬 스토리지-TLS 공간 가리킴)                                                                |
| IA32_GS_BASE                              | 64비트 모드에서 GS 세그먼트 기본 주소 저장                                                                                                                  |
| IA32_KERNEL_GS_BASE                       | 유저 모드와 커널 모드 전환 시 SWAPGS 명령어를 통해 GS_BASE 값과 교환할 커널 측 GS 기본 주소 보관                                                            |
| IA32_SYSENTER_CS / ESP / EIP              | 구형 32비트 환경에서 SYSENTER/SYSEXIT 처리용 커널 세그먼트(CS), 스택(ESP), 명령 포인터(EIP) 정의                                                            |
| IA32_MCU_OPT_CTRL                         | 마이크로코드 업데이트 옵션 제어: SRBDS 완화, RTM 제어, GDS 보안 완화 설정 온/오프 제어                                                                      |
| IA32_FLUSH_CMD                            | 캐시 플러시 제어: L1 데이터 캐시 등 미세 단위 무효화(Flush) 수행 및 사이드 채널 공격 방어                                                                   |
| IA32_TSX_CTRL                             | 인텔 TSX 기능 제어 및 비활성화 설정을 통한 관련 버그/취약점 회피                                                                                            |
| IA32_MCU_ROLLBACK_MIN_ID                  | 마이크로코드 롤백 공격 방지를 위한 최소 허용 마이크로코드 리비전 ID 보관                                                                                    |
| IA32_PERF_STATUS                          | 현재 프로세서 성능 상태(P-State, 클럭/전압 수준) 보고                                                                                                       |
| IA32_PERF_CTL                             | 운영체제의 목표 성능 상태(P-State) 전환 요청 제어                                                                                                           |
| IA32_HWP_REQUEST                          | 하드웨어 P-State 제어(Speed Shift): 최소/최대/목표 성능 및 에너지-성능 선호도 힌트 제공                                                                     |
| IA32_THERM_STATUS                         | 코어 온도 센서 데이터 및 발열 모니터링 경고 상태 보고                                                                                                       |
| IA32_THERM_INTERRUPT                      | 온도 임계값 초과 시 인터럽트 발생 설정                                                                                                                      |
| IA32_OVERCLOCKING_STATUS                  | 오버클럭 상태 및 언더볼팅 보호 활성화 여부 표시                                                                                                             |
| IA32_MCG_CAP                              | 지원 Machine Check 기능 및 오류 보고 뱅크 개수 정보 제공                                                                                                    |
| IA32_MCG_STATUS                           | Machine Check 에러 처리 상태 및 복구 가능 여부 표시                                                                                                         |
| IA32_MCi_CTL / STATUS / ADDR / MISC       | 하드웨어 유닛별 오류 제어 및 상태 정보 기록 (에러 주소, 상세 정보 포함)                                                                                     |
| IA32_PERFEVTSELx                          | 측정 대상 하드웨어 이벤트 선택 및 카운터 동작(User/OS 모드) 설정                                                                                            |
| IA32_PMC_FXx_CTR                          | 고정 기능 카운터: 명령어 실행 수, 코어 클럭 사이클 등 특정 성능 데이터 측정                                                                                 |
| IA32_PMC_GPx_CTR                          | 범용 성능 카운터: PERFEVTSELx 설정 이벤트 계수                                                                                                              |
| IA32_PEBS_BASE / INDEX                    | PEBS 샘플링 출력 버퍼 메모리 위치 및 인덱스 제어                                                                                                            |
| IA32_X2APIC_APICID                        | 현재 논리 코어의 x2APIC ID 값 제공                                                                                                                          |
| IA32_X2APIC_EOI                           | 인터럽트 처리 완료 통지 (쓰기 전용)                                                                                                                         |
| IA32_X2APIC_ICR                           | 코어 간 인터럽트(IPI) 전송 제어                                                                                                                             |
| IA32_X2APIC_LVT_TIMER / LINT / THERMAL 등 | 로컬 APIC 인터럽트 벡터 설정 (타이머, 열 센서, 로컬 인터럽트 등)                                                                                            |

## [PIC 레지스터 PIC Registers (p.4)](https://pdos.csail.mit.edu/6.828/2010/readings/hardware/8259A.pdf)

64 and IA-32 Architectures 스펙 문서에 존재하지 하지 않아, 과거 데이터시트를 참조로 하여 작성
| 이름 | 용도 |
|---|---|
| IRR (Interrupt Request Register) | 인터럽트 발생 시 처음으로 기록 |
| ISR (In-Service Register) | 해결 중인 인터럽트를 기록 |
| IMR (Interrupt Mask Register) | 요청 된 인터럽트 중 특정 인터럽트 처리를 차단(처리 유예) |

## Local APIC 레지스터 Local APIC Registers (Vol.3A p.13-6)

| 이름                                                  | 용도                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| Local APIC ID Register                                | ID                                                               |
| Local APIC Version Register                           | Version                                                          |
| TPR (Task Priority Register)                          | 현재 CPU가 받아들일 인터럽트 priority의 하한값(threshold)을 설정 |
| APR (Arbitration Priority Register)                   | 다중 코어 환경에서 같은 인터럽트 발생 시, 처리할 코어 선택       |
| PPR (Processor Priority Register)                     | max(TPR, ISR)                                                    |
| EOI (End Of Interrupt)                                | 인터럽트 처리가 끝났음을 표현                                    |
| RRD (Remote Read Register)                            | 타 APIC 레지스터 값을 간접적으로 읽기 위한 결과 저장             |
| Logical Destination Register                          | 논리적 인터럽트 전달 대상(APIC 그룹/집합) 지정                   |
| Destination Format Register                           | Logical Destination 방식의 주소 포맷(cluster/flat) 설정          |
| Spurious Interrupt Vector Register                    | Spurious 인터럽트 벡터 및 APIC enable 제어                       |
| ISR (In-Service Register)                             | 현재 서비스 중인 인터럽트들의 상태 (priority 포함)               |
| TMR (Trigger Mode Register)                           | 인터럽트가 edge/level 방식인지 표시                              |
| IRR (Interrupt Request Register)                      | 서비스 요청 대기 중인 인터럽트 저장                              |
| Error Status Register                                 | APIC 내부 에러 상태 기록                                         |
| LVT Corrected Machine Check Interrupt (CMCI) Register | Corrected Machine Check 인터럽트 설정                            |
| ICR (Interrupt Command Register)                      | 다른 APIC에 인터럽트(IPI) 전송                                   |
| LVT Timer Register                                    | 로컬 APIC 타이머 인터럽트 설정                                   |
| LVT Thermal Sensor Register                           | 온도 센서 인터럽트 설정                                          |
| LVT Performance Monitoring Counters Register          | 성능 카운터 인터럽트 설정                                        |
| LVT LINT0 - 1 Register                                | 외부 인터럽트 핀(LINT0/1) 설정                                   |
| LVT Error Register                                    | APIC 에러 인터럽트 설정                                          |
| Initial Count Register                                | 타이머 시작 카운트 값 설정                                       |
| Current Count Register                                | 현재 타이머 카운트 값                                            |
| Divide Configuration Register                         | 타이머 입력 클럭 분주 비율 설정                                  |

## Floating Point / SIMD Registers (Vol.1 p.8-2 / Vol.1 p.9-2 / Vol.1 p.10-3 / Vol.1 p.14-1 / Vol.1 p.15-1 / Vol.1 p.15-9 / Vol.1 p.10-4)

| 이름              | 용도                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| ST0 - ST7         | x87 FPU; 80-bit 부동소수점 스택 레지스터                              |
| Control Word (CW) | x87 FPU; 반올림 방식, 예외 처리 등 FPU 동작 제어                      |
| Status Word (SW)  | x87 FPU; 예외 상태, 조건 코드, 스택 포인터(TOP)                       |
| Tag Word (TW)     | x87 FPU; 각 ST 레지스터의 상태 (valid/empty 등)                       |
| FIP               | x87 FPU; 마지막 실행된 명령어 주소                                    |
| FDP               | x87 FPU; 마지막 명령어의 메모리 피연산자 주소                         |
| FCS / FDS         | x87 FPU; (구형) 세그먼트 정보                                         |
| FOP               | x87 FPU; 마지막 실행된 명령어 opcode                                  |
| MM0 - MM7         | x87 레지스터를 재사용한 64-bit 정수 SIMD                              |
| XMM0 - XMM15      | 128-bit SIMD 레지스터 (SSE)                                           |
| YMM0 - YMM15      | 256-bit SIMD 레지스터 (AVX)                                           |
| ZMM0 - ZMM31      | 512-bit SIMD 레지스터 (AVX-512)                                       |
| K0 - K7           | AVX-512 마스크 레지스터 (각 SIMD 요소별 연산 수행 여부를 비트로 제어) |
| MXCSR             | SIMD 부동소수점 제어 및 상태 레지스터                                 |

## MSI (Message Signaled Interrupt) Registers (Vol.3A p.13-35)

| 이름                     | 용도                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Message Address Register | 인터럽트를 전달할 APIC 대상(목적지 CPU/코어 및 전달 방식)을 지정  |
| Message Data Register    | 인터럽트 벡터 및 전달 방식(Delivery Mode, Trigger Mode 등)을 지정 |

## MPX 관련 레지스터 Bounds Registers (Vol.1 p.E-3)

| 이름                   | 용도                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| BND0 - BND3            | 상한 64Bits, 하한 64Bits로 구성된 검사할 메모리의 범위를 지정    |
| BNDCFGU / IA32_BNDCFGS | User mode, Supervisor mode와 구분해서 메모리 범위 검사의 설정 값 |
| BNDSTATUS              | 메모리 범위 초과 검사의 상태 저장 (에러와 에러가 발생한 위치)    |

## 타이머 관련 레지스터 Timer etc. (Vol.3B p.20-42 / [PIT Spec](https://www.scs.stanford.edu/10wi-cs140/pintos/specs/8254.pdf) / [HPET Spec](https://www.intel.com/content/dam/www/public/us/en/documents/technical-specifications/software-developers-hpet-spec-1-0a.pdf))

| 이름                               | 용도                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| TSC (Time Stamp Counter)           | CPU 클럭 기준으로 증가하는 64-bit 카운터 (고해상도 시간 측정, 성능 분석에 사용)                                    |
| RDTSCP                             | TSC와 CPU 식별값을 원자적으로 읽어 CPU migration 감지 가능                                                         |
| IA32_TSC_AUX                       | RDTSCP에서 함께 반환되는 보조 식별 값 (논리 CPU ID 등)                                                             |
| Counter 0                          | 8254 PIT; 16-bit 카운터 (주로 시스템 타이머(interrupt on terminal count); I/O 포트 0x40)                           |
| Counter 1                          | 8254 PIT; 16-bit 카운터 (메모리 DRAM refresh용...; I/O 포트 0x41)                                                  |
| Counter 2                          | 8254 PIT; 16-bit 카운터 (PC speaker...; I/O 포트 0x42)                                                             |
| Control Word Register              | 8254 PIT; 카운터 모드, LSB/MSB 설정, BCD/바이너리 설정 등 제어 (I/O 포트 0x43)                                     |
| General Capabilities and ID        | MMIO HPET; 카운터 해상도(COUNTER_CLK_PERIOD), 지원 타이머 개수(NUM_TIM_CAP), 64-bit 카운터 여부(COUNT_SIZE_CAP) 등 |
| General Configuration              | MMIO HPET; 전체 타이머 활성화(ENABLE_CNF), 레거시 IRQ 매핑(LEG_RT_CNF)                                             |
| General Interrupt Status           | MMIO HPET; 각 타이머별 인터럽트 발생 여부 표시                                                                     |
| Main Counter Value                 | MMIO HPET; 64-bit 업 카운터의 현재 값 저장                                                                         |
| Timer N Configuration/Capabilities | MMIO HPET; 인터럽트 타입(Tn_INT_TYPE_CNF), 주기적 모드(Tn_TYPE_CNF), I/O APIC 인터럽트 라인 지정(Tn_INT_ROUTE_CNF) |
| Timer N Comparator Value           | MMIO HPET; 메인 카운터와 비교할 목표 값 저장, 비주기 모드/주기 모드 설정                                           |
| Timer N FSB Interrupt Route        | MMIO HPET; FSB(Front Side Bus)를 통해 직접 CPU 인터럽트 전달                                                       |

## Protection-Key Rights Register (Vol.3A p.2-23)

| 이름      | 용도                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PKRU      | 유저모드에서 페이지에 대한 접근 권한 제어, 각 페이지에 할당된 4비트 Protection Key(0-15)를 기반으로 데이터 접근(AD) 및 쓰기(WD) 권한을 비트 단위로 설정                        |
| IA32_PKRS | [MSR](#msr-%EB%A0%88%EC%A7%80%EC%8A%A4%ED%84%B0-model-specific-registers-vol4-p2-4) 레지스터 내에 있으며, Supervisor-mode에서 페이지에 대한 접근 권한 제어, PKRU와 동일한 구조 |
