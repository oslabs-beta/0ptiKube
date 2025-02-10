# Test Pod Scenarios

## 1. Launch Day Target Pod
**Real-World Example: "The Small E-commerce Flash Sale"**
An online boutique launched a limited edition product. Their system, designed for 100 concurrent users, suddenly received 1,000 requests per minute. Response times jumped from 200ms to 2000ms, with CPU usage spiking to 90% and memory reaching 85% utilization. The checkout process slowed significantly, leading to abandoned carts and lost sales.

**Scenario Details:**
- Initial State: Standard resources (256Mi memory, 250m CPU)
- Traffic Pattern: 10x spike (100 to 1,000 requests/minute)
- Expected Behavior: Response time degradation, resource saturation
- Monitoring Focus: CPU spikes, memory pressure, response latency

**Expected Recommendations:**
- Scale memory to 512Mi for traffic spikes
- Increase CPU to 500m to handle concurrent requests
- Enable basic horizontal scaling (2-3 replicas)
- Implement request queuing
- Add basic rate limiting

## 2. Normal Operations Pod
**Real-World Example: "The Local News Site"**
A regional news website handles three daily traffic peaks. Their baseline traffic is 100 requests per minute, doubling during peak hours. The system maintains stable performance with occasional minor slowdowns during breaking news.

**Scenario Details:**
- Configuration: Balanced resources (256Mi memory, 250m CPU)
- Traffic Pattern: 2x spikes three times daily
- Load Type: 80% read, 20% write operations
- Baseline: 100 requests/minute
- Peak: 200 requests/minute

**Expected Recommendations:**
- Current configuration is adequate
- Set up alerts for >80% resource usage
- Monitor daily peak patterns
- Plan for 1.5x current capacity

## 3. Error Conditions Pod
**Real-World Example: "The Development Environment Crash"**
A development team deployed their test environment with minimal resources. During integration testing, the service started throwing 503 errors under normal load. Response times exceeded 5 seconds, and the pod crashed repeatedly.

**Scenario Details:**
- Configuration: Minimal resources (64Mi memory, 100m CPU)
- Traffic Pattern: Steady 50 requests/minute
- Error Triggers: Memory exhaustion, CPU throttling
- Common Issues: Pod restarts, request failures

**Expected Recommendations:**
- Increase memory to 128Mi
- Set CPU to 200m
- Add basic health checks
- Implement retry logic
- Set resource quotas

## 4. Database Load Pod
**Real-World Example: "The Report Generator Overload"**
A small business's reporting service, handling typical transaction logging during the day, struggles when generating end-of-day reports. Queries that normally take 1 minute extend to 5 minutes, affecting system responsiveness.

**Scenario Details:**
- Initial State: Standard resources (256Mi memory, 250m CPU)
- Normal Load: 50 transactions/minute
- Peak Load: Report generation (100% CPU, high memory)
- Duration: 5-minute reporting windows

**Expected Recommendations:**
- Increase memory to 512Mi for report processing
- Maintain current CPU allocation
- Add basic query optimization
- Implement connection pooling
- Consider time-window constraints