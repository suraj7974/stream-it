# DigitalOcean Firewall Rules for StreamIT

## Inbound Rules

### 1. SSH

- Type: SSH
- Protocol: TCP
- Port: 22
- Sources: All IPv4, All IPv6

### 2. HTTP

- Type: HTTP
- Protocol: TCP
- Port: 80
- Sources: All IPv4, All IPv6

### 3. HTTPS

- Type: HTTPS
- Protocol: TCP
- Port: 443
- Sources: All IPv4, All IPv6

### 4. LiveKit TCP

- Type: Custom
- Protocol: TCP
- Port: 7881
- Sources: All IPv4, All IPv6

### 5. TURN UDP

- Type: Custom
- Protocol: UDP
- Port: 3478
- Sources: All IPv4, All IPv6

### 6. LiveKit WebRTC UDP Range

- Type: Custom
- Protocol: UDP
- Port Range: 50000-60000
- Sources: All IPv4, All IPv6

## Outbound Rules

### 1. All TCP

- Protocol: TCP
- Ports: All ports
- Destinations: All IPv4, All IPv6

### 2. All UDP

- Protocol: UDP
- Ports: All ports
- Destinations: All IPv4, All IPv6

## Notes

- Make sure to assign this firewall to your droplet
- UFW should be disabled on the VM when using DigitalOcean Cloud Firewall
