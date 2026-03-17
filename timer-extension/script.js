class DeWdTimer {
    constructor() {
        this.timeElapsed = 0;
        this.maxTime = 15 * 60;
        this.isRunning = false;
        this.animationFrameId = null;
        this.canvas = document.getElementById('faceCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.setupEventListeners();
        this.draw();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning && this.timeElapsed < this.maxTime) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    reset() {
        this.isRunning = false;
        this.timeElapsed = 0;
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.updateDisplay();
        this.draw();
    }

    animate() {
        const startTime = Date.now() - this.timeElapsed * 1000;
        const loop = () => {
            if (this.isRunning) {
                this.timeElapsed = (Date.now() - startTime) / 1000;
                if (this.timeElapsed >= this.maxTime) {
                    this.timeElapsed = this.maxTime;
                    this.isRunning = false;
                    this.startBtn.disabled = false;
                    this.stopBtn.disabled = true;
                }
                this.updateDisplay();
                this.draw();
                this.animationFrameId = requestAnimationFrame(loop);
            }
        };
        loop();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = Math.floor(this.timeElapsed % 60);
        this.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        this.secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    draw() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 100;
        const progress = this.timeElapsed / this.maxTime;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2 * progress);
        this.ctx.stroke();
        const eyeY = centerY - 25;
        const leftEyeX = centerX - 30;
        const rightEyeX = centerX + 30;
        const eyeRadius = 8;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        const pupilOffset = progress * 6;
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX + pupilOffset, eyeY, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightEyeX + pupilOffset, eyeY, 4, 0, Math.PI * 2);
        this.ctx.fill();
        const mouthY = centerY + 35;
        const mouthWidth = 30;
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        if (progress < 0.5) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, mouthY, mouthWidth, 0, Math.PI);
            this.ctx.stroke();
        } else if (progress < 0.85) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, mouthY + 5, mouthWidth, 0, Math.PI);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(centerX, mouthY + 10, mouthWidth + 5, 0, Math.PI);
            this.ctx.stroke();
        }
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 5);
        this.ctx.lineTo(centerX, centerY + 10);
        this.ctx.stroke();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DeWdTimer();
});