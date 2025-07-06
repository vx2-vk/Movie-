document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const headlineTextElement = document.getElementById('headlineText');
    const fromMessageElement = document.getElementById('fromMessage');
    const currentUserNameDisplayElement = document.getElementById('currentUserNameDisplay');
    const whatsappShareButton = document.getElementById('whatsappShareButton');

    // --- URL Parameter and Name Logic ---
    const getUrlParameter = (paramName) => {
        paramName = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const senderName = getUrlParameter('from'); // Check for 'from' parameter

    // Function to update the UI based on 'from' parameter or user input
    const updateUI = () => {
        if (senderName) {
            // Scenario: Visitor opened the link (has 'from' parameter)
            headlineTextElement.textContent = "దీపావళి శుభాకాంక్షలు!"; // Main greeting
            fromMessageElement.textContent = `${senderName} నుండి`; // Display sender's name in Telugu
            fromMessageElement.style.display = 'block'; // Show the 'from' message

            currentUserNameDisplayElement.textContent = ''; // Clear current user's typed name display
            nameInput.value = ''; // Ensure input is empty for new sender
            nameInput.placeholder = 'మీ పేరు నమోదు చేయండి'; // Prompt for new sender in Telugu

            headlineTextElement.classList.add('animated-welcome'); // Trigger welcome animation

            whatsappShareButton.style.display = 'flex'; // Show WhatsApp button
        } else {
            // Scenario: Original sender (no 'from' parameter or cleared input)
            headlineTextElement.textContent = "దీపావళి శుభాకాంక్షలు!"; // Default greeting
            fromMessageElement.style.display = 'none'; // Hide 'from' message

            // Update current user's typed name display
            currentUserNameDisplayElement.textContent = nameInput.value.trim() ? `${nameInput.value.trim()} నుండి` : ''; // Added Telugu "నుండి"
            nameInput.placeholder = 'మీ పేరు నమోదు చేయండి'; // Default placeholder in Telugu

            headlineTextElement.classList.remove('animated-welcome'); // Remove animation class

            // Hide WhatsApp button if no name typed, show if typing
            if (nameInput.value.trim() !== '') {
                whatsappShareButton.style.display = 'flex';
            } else {
                whatsappShareButton.style.display = 'none';
            }
        }
        updateShareLinks(); // Always update share links based on current input
    };

    // Event listener for name input changes
    nameInput.addEventListener('input', () => {
        updateUI(); // Update UI as user types
    });

    // --- Share Link Logic ---
    const updateShareLinks = () => {
        const nameForLink = nameInput.value.trim(); // Get name from input box
        const baseUrl = window.location.origin + window.location.pathname;
        const shareableLink = nameForLink ? `${baseUrl}?from=${encodeURIComponent(nameForLink)}` : baseUrl;

        // WhatsApp message: includes "from [Name]" if name is present (in Telugu)
        const whatsappMessage = `దీపావళి శుభాకాంక్షలు! ${nameForLink ? nameForLink + ' నుండి మీకు శుభాకాంక్షలు!' : ''} ఈ శుభాకాంక్షలు చూడండి: ${shareableLink}`;
        
        // Set the href for the fallback, even if navigator.share is preferred
        whatsappShareButton.href = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    };

    // "OK" button click handler
    window.generateLinkAndShare = async () => {
        const nameForLink = nameInput.value.trim();
        const baseUrl = window.location.origin + window.location.pathname;
        const linkToCopy = nameForLink ? `${baseUrl}?from=${encodeURIComponent(nameForLink)}` : baseUrl;

        try {
            // Use navigator.clipboard.writeText if available (modern browsers)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(linkToCopy);
                alert('లింక్ కాపీ చేయబడింది! ఇప్పుడు షేర్ చేయండి.'); // Translated alert
            } else {
                // Fallback for older browsers (document.execCommand is deprecated but widely supported)
                const tempInput = document.createElement('textarea');
                tempInput.value = linkToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('లింక్ కాపీ చేయబడలేదు. దయచేసి మాన్యువల్‌గా కాపీ చేయండి: ' + linkToCopy); // Translated alert
            }

            whatsappShareButton.style.display = 'flex'; // Show WhatsApp button
            updateShareLinks(); // Ensure WhatsApp link is updated
        } catch (err) {
            console.error('Failed to copy link: ', err);
            alert('లింక్ కాపీ చేయడంలో లోపం సంభవించింది. దయచేసి మాన్యువల్‌గా కాపీ చేయండి: ' + linkToCopy); // Translated alert
        }
    };

    // --- WhatsApp Button Click Handler ---
    whatsappShareButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default link navigation

        const nameForLink = nameInput.value.trim();
        const baseUrl = window.location.origin + window.location.pathname;
        const shareableLink = nameForLink ? `${baseUrl}?from=${encodeURIComponent(nameForLink)}` : baseUrl;
        // WhatsApp message: includes "from [Name]" if name is present (in Telugu)
        const whatsappMessageText = `దీపావళి శుభాకాంక్షలు! ${nameForLink ? nameForLink + ' నుండి మీకు శుభాకాంక్షలు!' : ''} ఈ శుభాకాంక్షలు చూడండి: ${shareableLink}`;

        if (navigator.share) {
            // Use native Web Share API if available
            try {
                await navigator.share({
                    title: 'దీపావళి శుభాకాంక్షలు!', // Translated title
                    text: whatsappMessageText,
                    url: shareableLink
                });
                console.log('Content shared successfully via Web Share API');
            } catch (error) {
                // User cancelled share or error occurred, fallback to WhatsApp Web/App link
                console.error('Error sharing via Web Share API, falling back:', error);
                window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessageText)}`, '_blank');
            }
        } else {
            // Fallback to WhatsApp Web/App link directly
            window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessageText)}`, '_blank');
        }
    });


    // --- Firecracker Animation Logic ---
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let particles = [];
    const gravity = 0.05;

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize(); // Set initial size
    window.addEventListener('resize', setCanvasSize); // Adjust on resize

    class Particle {
        constructor(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.01; // Increased decay for faster fade
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.vy += gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
            ctx.fill();
        }
    }

    class Firecracker {
        constructor(startX, startY, targetX, targetY) {
            this.x = startX;
            this.y = startY;
            this.targetX = targetX;
            this.targetY = targetY;
            this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
            this.angle = Math.atan2(targetY - startY, targetX - startX);
            this.vx = Math.cos(this.angle) * (Math.random() * 6 + 4); // Increased initial velocity
            this.vy = Math.sin(this.angle) * (Math.random() * 6 + 4);
            this.particles = [];
            this.exploded = false;
            this.trail = [];
            this.trailColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        }

        update() {
            if (!this.exploded) {
                this.trail.push({ x: this.x, y: this.y, alpha: 1, size: Math.random() * 1.5 + 0.5 });
                if (this.trail.length > 20) this.trail.shift();

                if (this.y <= this.targetY) { // Explode when rocket reaches target Y
                    this.explode();
                } else {
                    this.x += this.vx;
                    this.y += this.vy;
                }
            } else {
                this.particles.forEach((particle, index) => {
                    particle.update();
                    if (particle.alpha <= 0) {
                        this.particles.splice(index, 1);
                    }
                });
            }
        }

        draw() {
            if (!this.exploded) {
                this.trail.forEach(p => {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.trailColor.match(/\d+/)[0]}, 100%, 70%, ${p.alpha})`;
                    ctx.fill();
                    p.alpha -= 0.05;
                });

                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();

            } else {
                this.particles.forEach(particle => particle.draw());
            }
        }

        explode() {
            this.exploded = true;
            const colors = [
                { r: 255, g: 255, b: 255 }, // White
                { r: 255, g: 0, b: 0 },     // Red
                { r: 0, g: 255, b: 0 },     // Green
                { r: 0, g: 0, b: 255 },     // Blue
                { r: 255, g: 255, b: 0 },   // Yellow
                { r: 255, g: 0, b: 255 },   // Magenta
                { r: 0, g: 255, b: 255 },   // Cyan
                { r: 255, g: 140, b: 0 }    // Orange (your theme color)
            ];

            for (let i = 0; i < 100; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2; // Increased particle speed
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                this.particles.push(new Particle(this.x, this.y, vx, vy, randomColor));
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas each frame

        fireworks.forEach((firecracker, index) => {
            firecracker.update();
            firecracker.draw();
            if (firecracker.exploded && firecracker.particles.length === 0) {
                fireworks.splice(index, 1); // Remove firecracker if all particles are gone
            }
        });

        requestAnimationFrame(animate);
    }

    // Function to create a new firecracker
    function createFirecracker() {
        const startX = canvas.width / 2; // Always start from bottom center
        const startY = canvas.height;
        const targetX = Math.random() * canvas.width; // Random X target
        const targetY = Math.random() * (canvas.height * 0.6) + (canvas.height * 0.1); // Explode in upper 60% of screen

        fireworks.push(new Firecracker(startX, startY, targetX, targetY));
    }

    // Launch firecrackers automatically every 1.5 seconds
    setInterval(createFirecracker, 1500);

    // Start the animation
    animate();

    // Initial UI update when the page loads
    updateUI();
});
