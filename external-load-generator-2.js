"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadGenerator = void 0;
var worker_threads_1 = require("worker_threads");
var axios_1 = require("axios");
var LoadGenerator = /** @class */ (function () {
    function LoadGenerator(config) {
        this.config = config;
        this.running = false;
        this.startTime = 0;
        this.completedRequests = 0;
        this.errors = 0;
        this.workers = [];
        this.memoryPressure = [];
    }
    LoadGenerator.prototype.runWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.generateLoad()];
            });
        });
    };
    LoadGenerator.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numWorkers, i, worker, statsInterval_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!worker_threads_1.isMainThread) return [3 /*break*/, 1];
                        console.log('Main thread starting...');
                        numWorkers = Math.min(this.config.concurrentUsers, 5);
                        console.log("Creating ".concat(numWorkers, " workers..."));
                        this.running = true;
                        this.startTime = Date.now();
                        // Create workers
                        for (i = 0; i < numWorkers; i++) {
                            console.log("Creating worker ".concat(i + 1, "..."));
                            worker = new worker_threads_1.Worker(__filename, {
                                workerData: this.config,
                            });
                            this.workers.push(worker);
                            worker.on('message', function (message) {
                                if (message.type === 'completed') {
                                    _this.completedRequests++;
                                }
                                else if (message.type === 'error') {
                                    _this.errors++;
                                    console.error("Worker error: ".concat(message.error));
                                }
                            });
                            worker.on('error', function (error) {
                                console.error('Worker error:', error);
                                _this.errors++;
                            });
                            worker.on('exit', function (code) {
                                if (code !== 0) {
                                    console.error("Worker stopped with exit code ".concat(code));
                                }
                            });
                        }
                        // Set test duration
                        setTimeout(function () {
                            _this.stop();
                        }, this.config.durationMinutes * 60 * 1000);
                        statsInterval_1 = setInterval(function () {
                            _this.printStats();
                            if (!_this.running) {
                                clearInterval(statsInterval_1);
                            }
                        }, 5000);
                        return [3 /*break*/, 3];
                    case 1: 
                    // Worker process
                    return [4 /*yield*/, this.generateLoad()];
                    case 2:
                        // Worker process
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadGenerator.prototype.stop = function () {
        this.running = false;
        for (var _i = 0, _a = this.workers; _i < _a.length; _i++) {
            var worker = _a[_i];
            worker.terminate();
        }
        this.workers = [];
        this.printStats();
    };
    LoadGenerator.prototype.generateLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, delayMs, numbers, url, startTime, elapsed, remainingDelay, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!worker_threads_1.parentPort) {
                            console.log('No parent port available');
                            return [2 /*return*/];
                        }
                        console.log('Worker starting load generation');
                        config = worker_threads_1.workerData;
                        console.log('Worker received config:', config);
                        delayMs = 1000 / config.requestsPerSecond;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        if (config.memoryIntensive) {
                            numbers = new Array(10000).fill(0).map(function () { return Math.random(); });
                            numbers.sort(); // Quick operation but still uses CPU
                            // Keep a reference to prevent garbage collection (memory pressure)
                            if (!this.memoryPressure) {
                                this.memoryPressure = [];
                            }
                            this.memoryPressure.push(numbers);
                            // Cap the memory usage to prevent crashes
                            if (this.memoryPressure.length > 100) {
                                this.memoryPressure.shift();
                            }
                        }
                        url = config.targetUrls[Math.floor(Math.random() * config.targetUrls.length)];
                        startTime = Date.now();
                        return [4 /*yield*/, (0, axios_1.default)({
                                method: 'GET',
                                url: url,
                                timeout: 5000,
                            })];
                    case 3:
                        _a.sent();
                        worker_threads_1.parentPort.postMessage({ type: 'completed' });
                        elapsed = Date.now() - startTime;
                        remainingDelay = Math.max(0, delayMs - elapsed);
                        return [4 /*yield*/, this.sleep(remainingDelay)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        worker_threads_1.parentPort.postMessage({
                            type: 'error',
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                        });
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LoadGenerator.prototype.printStats = function () {
        var elapsed = (Date.now() - this.startTime) / 1000;
        var rps = this.completedRequests / elapsed;
        console.log("\nLoad Test Statistics:\n-------------------\nRuntime: ".concat(elapsed.toFixed(0), "s\nRequests Completed: ").concat(this.completedRequests, "\nErrors: ").concat(this.errors, "\nRequests/second: ").concat(rps.toFixed(2), "\nError rate: ").concat(((this.errors / this.completedRequests) * 100).toFixed(2), "%\n        "));
    };
    LoadGenerator.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return LoadGenerator;
}());
exports.LoadGenerator = LoadGenerator;
// Main execution
if (worker_threads_1.isMainThread) {
    console.log('Starting in main thread mode');
    var config = {
        targetUrls: [
            'http://localhost:3000/api/metrics/container/cpu/percent',
            'http://localhost:3000/api/metrics/container/cpu/history',
            'http://localhost:3000/api/metrics/container/memory/percent',
            'http://localhost:3000/api/metrics/container/memory/history',
            'http://localhost:3000/api/metrics/cluster/cpu/percent',
            'http://localhost:3000/api/metrics/cluster/cpu/history',
            'http://localhost:3000/api/metrics/cluster/memory/percent',
            'http://localhost:3000/api/metrics/cluster/memory/history',
        ],
        durationMinutes: 10,
        concurrentUsers: 100,
        requestsPerSecond: 200,
        rampUpSeconds: 15,
        memoryIntensive: true,
    };
    var generator = new LoadGenerator(config);
    generator.start().catch(function (error) {
        console.error('Load generation failed:', error);
    });
}
else {
    console.log('Starting in worker mode');
    var generator = new LoadGenerator(worker_threads_1.workerData);
    generator.runWorker().catch(function (error) {
        console.error('Worker failed:', error);
    });
}
