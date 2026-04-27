```
Application:   REST / HTTP / HTTPS / DNS
Transport:     TCP / UDP
Network:       IP + IGP + BGP
Link:          Ethernet / ARP
Infra:         Hypervisor (virtual NIC / cable)

[Hypervisor OS]
  - VM lifecycle (create/run/stop)
  - CPU scheduling
  - memory isolation (guest phys ↔ host phys)
  - interrupt / exception virtualization
  - Physical NIC driver
    - link state (up/down)
    - auto-negotiation (speed/duplex)
    - MTU handling
    - offload control (checksum/TSO disable or 지원)
    - Promiscuous mode

  [Virtual Networking]
    - virtual NIC (per VM)
    - virtual cable (TX/RX queue)
    - virtual switch (L2 forwarding fabric)
    - optional VLAN tagging (802.1Q)

  [Core Infra]
    - packet buffer system (mbuf)
    - timer / clock
    - interrupt handling
    - debug / console (serial/log)
    - packet capture (pcap-like tracing)

--------------------------------------------------

[Host OS]
  [Link Layer]
    - Ethernet (frame encode/decode)
    - ARP (request/reply)
    - ARP cache (timeout, retry)

  [Network Layer]
    - IPv4 (header, checksum)
    - fragmentation / reassembly
    - Path MTU Discovery (ICMP 기반)

  [Transport Layer]
    - UDP (datagram)
    - TCP
      - 3-way handshake
      - state machine
      - retransmission (RTO)
      - congestion control (basic)
      - MSS negotiation
      - window scaling
      - SACK (optional but recommended)

  [Socket Layer]
    - socket abstraction (bind/listen/connect)
    - port management (ephemeral port)
    - send/recv buffer

  [System]
    - checksum utilities
    - byte order handling

--------------------------------------------------

[Switch OS]
  [L2 Core]
    - MAC learning table
    - forwarding (unicast)
    - flooding (broadcast/unknown)

  [Stability]
    - MAC aging (timeout)
    - loop prevention (storm control / STP-lite)

  [Interface]
    - multi-port abstraction
    - frame validation (drop invalid)

--------------------------------------------------

[Router OS]

  --------------------------------------------------
  [Physical / External Connectivity]

    - WAN interface (physical NIC 연결)
    - ISP handoff (Ethernet / IX / cross-connect)
    - link state monitoring
    - optional BFD (fast failure detection)

    [Addressing]
      - WAN IP (/30, /31, IX subnet)
      - loopback interface (router-id, iBGP 안정성)

  --------------------------------------------------
  [Control Plane vs Data Plane]

  [Control Plane]
    - BGP
    - RIB
    - route policy engine
    - RPKI validation

  [Data Plane]
    - FIB (optimized structure: radix tree / trie)
    - fast path forwarding
    - ECMP (multi next-hop + hashing)
    - control-plane policing (CoPP)

  --------------------------------------------------

  [Link Layer]
    - Ethernet
    - ARP (cache 포함)

  --------------------------------------------------

  [Network Layer Core]
    - IPv4 forwarding
    - TTL decrement
    - fragmentation handling
    - ICMP
      - echo
      - destination unreachable
      - TTL exceeded
      - fragmentation needed (PMTU)

  --------------------------------------------------

  [Forwarding Engine]
    - FIB (Forwarding Information Base)
    - Longest Prefix Match (LPM)
    - ECMP 지원 (5-tuple hashing)

  --------------------------------------------------

  [Routing Core]
    - RIB (Routing Information Base)
    - route install (RIB → FIB)
    - IGP cost calculation (intra-AS metric)
    - next-hop reachability 보장

  --------------------------------------------------
  [Addressing Model]
    - ISP assigned prefix (real public IP block)
    - global uniqueness 보장

  [AS (Autonomous System)]
    - ASN (public ASN)
    - AS 단위 그룹 구성

  --------------------------------------------------

  [IGP (AS 내부 라우팅)]
    - static routing (초기)
    - 또는 distance-vector (RIP-like)
    - intra-AS path 계산
    - loopback reachability
    - iBGP 지원 시 route reflector (optional)

  --------------------------------------------------

  [BGP (AS 간 라우팅)]

    [Session]
      - TCP (port 179)
      - BGP FSM (Idle → Connect → Active → OpenSent → OpenConfirm → Established)
      - keepalive / hold timer 관리
      - graceful restart
      - import/export policy
      - max-prefix 보호

    [Message]
      - OPEN / UPDATE / KEEPALIVE / NOTIFICATION

    [Path Attributes]
      - ORIGIN
      - AS_PATH
      - NEXT_HOP
      - LOCAL_PREF
      - MED
      - COMMUNITY
      - ATOMIC_AGGREGATE
      - AGGREGATOR

    [Best Path Selection]
      - highest LOCAL_PREF
      - shortest AS_PATH
      - lowest ORIGIN type
      - lowest MED
      - eBGP > iBGP
      - lowest IGP cost to NEXT_HOP
      - oldest path
      - lowest router ID

    [eBGP Features]
      - multi-hop eBGP
      - next-hop-self
      - prefix filtering (in/out)
      - max-prefix protection

    [iBGP Scaling]
      - route reflector (optional)

    [Stability]
      - route flap damping

  --------------------------------------------------

  [Routing Policy Engine]

    - prefix-list
    - AS-path filter
    - community match/set
    - route-map (policy chain)

    [Inbound Filtering]
      - bogon drop
      - RPKI invalid drop
      - prefix length 제한

    [Outbound Filtering]
      - own prefix only advertise
      - route leak 방지

    [Traffic Engineering]
      - outbound: LOCAL_PREF 조정
      - inbound: AS_PATH prepending / MED / COMMUNITY

  --------------------------------------------------

  [RPKI Validation]

    - ROA 등록 (prefix ↔ ASN)
    - RPKI RTR client
    - validation state:
      - valid
      - invalid (drop)
      - not found

  --------------------------------------------------

  [Security]

    [Control Plane]
      - TCP MD5 (BGP authentication)
      - TTL security (GTSM)
      - control-plane rate limit

    [Data Plane]
      - uRPF (strict / loose)
      - bogon filtering
      - ingress ACL (default deny)

  --------------------------------------------------

  [NAT / PAT]

    [Mode 선택]

    - Routed Public Model
      - 내부 서버에 public IP 직접 할당
      - NAT 없음

    - Edge NAT Model
      - SNAT (outbound)
      - DNAT / port-forward (inbound)

    - Hybrid (DMZ)

    - connection tracking table (conntrack)
    - timeout 관리

  --------------------------------------------------

  [MTU / Transport Handling]

    - WAN MTU 설정
    - PMTU blackhole 방지
    - ICMP fragmentation-needed 허용
    - MSS clamping (필요 시)

  --------------------------------------------------

  [DHCP]

    - server:
      - IP pool
      - lease table
    - client (WAN):
      - DISCOVER → OFFER → REQUEST → ACK

  --------------------------------------------------

  [DNS / External Exposure]

    - authoritative DNS (public zone)
    - reverse DNS (PTR)
    - 서비스 도메인 매핑 (A/NS Record)

  --------------------------------------------------

  [High Availability]

    - dual router 구성
    - VRRP-like gateway redundancy
    - BGP multipath
    - graceful restart

  --------------------------------------------------

  [Observability / 운영]

    - logging (control / data plane)
    - packet tracing
    - flow export (NetFlow/sFlow-like)
    - metrics (interface / route / session)
    - BGP session monitoring
    - route propagation 확인
    - alerting system

  --------------------------------------------------

  [Peering / Internet Integration]

    - Transit ISP 계약
    - IX 참여 (optional)
    - IRR route object 등록
    - PeeringDB 등록 (optional)

  --------------------------------------------------

  [Validation / Testing]

    - external traceroute
    - looking glass 검증
    - RPKI 상태 확인
    - latency / loss 측정

[E.T.C.]
- Support 'Routed Public Model / Edge NAT Model / DMZ'
- Own Public ASN
- Own Public IP Prefix
- Transit with ISP
```

위 구조를 하드웨어만 있는 상태에서 하나하나 구현해나갈거야. OS, 커널을 모두 직접 개발할 예정이야. 최종 목표는 외부 네트워크에서 자체 개발 Hypervisor OS 내부의 서버에 접속이 가능하게 하는 것. 실제 물리 NIC Driver 구현과 외부와의 연결은 가장 마지막이고, 먼저 자체 개발 Hypervisor OS 내에 자체 개발한 OS, 커널들이 현대 네트워크 구조를 완벽하게 시뮬레이션하는 것. RFC 표준을 포함한 모든 표준을 준수할 거야. 개발 기간 30년을 생각하고 있고 네트워크의 진보의 경우 대응하면서 개발할 예정이야. 30년의 해당 거대한 프로젝트를 위한 Step-by-Step 개발 로드맵을 설계해.
