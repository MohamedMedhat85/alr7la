import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const TravelDestinationSlider = () => {
  const demoRef = useRef(null);
  const slideNumbersRef = useRef(null);
  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    navigate('/discover');
  };

  useEffect(() => {
    const data = [
      {
        place: 'Switzerland Alps',
        title: 'SAINT',
        title2: 'ANTONIEN',
        description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.',
        image: 'https://assets.codepen.io/3685267/timed-cards-1.jpg'
      },
      {
        place: 'Japan Alps',
        title: 'NANGANO',
        title2: 'PREFECTURE',
        description: 'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country\'s best powder.',
        image: 'https://assets.codepen.io/3685267/timed-cards-2.jpg'
      },
      {
        place: 'Sahara Desert - Morocco',
        title: 'MARRAKECH',
        title2: 'MEROUGA',
        description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
        image: 'https://assets.codepen.io/3685267/timed-cards-3.jpg'
      },
      {
        place: 'Sierra Nevada - USA',
        title: 'YOSEMITE',
        title2: 'NATIONAL PARAK',
        description: 'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
        image: 'https://assets.codepen.io/3685267/timed-cards-4.jpg'
      },
      {
        place: 'Tarifa - Spain',
        title: 'LOS LANCES',
        title2: 'BEACH',
        description: 'Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach\'s long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.',
        image: 'https://assets.codepen.io/3685267/timed-cards-5.jpg'
      },
      {
        place: 'Cappadocia - Turkey',
        title: 'Göreme',
        title2: 'Valley',
        description: 'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
        image: 'https://assets.codepen.io/3685267/timed-cards-6.jpg'
      },
    ];

    let order = [0, 1, 2, 3, 4, 5];
    let detailsEven = true;
    let offsetTop = window.innerHeight - 250;
    let offsetLeft = 700;
    let cardWidth = 160;
    let cardHeight = 180;
    let gap = 25;
    let numberSize = 35;
    const ease = "power2.inOut";
    let clicks = 0;
    let isAnimating = false;

    // Helper functions
    const getCard = (index) => `#card${index}`;
    const getCardContent = (index) => `#card-content-${index}`;
    const getSliderItem = (index) => `#slide-item-${index}`;

    const updateDimensions = () => {
      const { innerHeight: height, innerWidth: width } = window;
      offsetTop = height - 250;
      offsetLeft = Math.min(width - 750, width * 0.8);
      cardWidth = Math.min(160, width * 0.15);
      cardHeight = Math.min(180, height * 0.25);
      gap = Math.min(25, width * 0.02);
      numberSize = Math.min(35, width * 0.03);
    };

    const animate = (target, duration, properties) => {
      return new Promise((resolve) => {
        gsap.to(target, {
          ...properties,
          duration: duration,
          onComplete: resolve,
        });
      });
    };

    // Initialize the slider
    const init = () => {
      updateDimensions();
      const [active, ...rest] = order;
      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
      const { innerWidth: width } = window;

      // Position pagination
      gsap.set("#pagination", {
        top: offsetTop + cardHeight + 30,
        left: offsetLeft,
        y: 200,
        opacity: 0,
        zIndex: 60,
      });

      gsap.set(getCard(active), {
        x: 0,
        y: 0,
        width: width,
        height: window.innerHeight,
      });
      gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
      gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
      gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
      gsap.set(`${detailsInactive} .text`, { y: 100 });
      gsap.set(`${detailsInactive} .title-1`, { y: 100 });
      gsap.set(`${detailsInactive} .title-2`, { y: 100 });
      gsap.set(`${detailsInactive} .desc`, { y: 50 });
      gsap.set(`${detailsInactive} .cta`, { y: 60 });

      gsap.set(".progress-sub-foreground", {
        width: 500 * (1 / order.length) * (active + 1),
      });

      rest.forEach((i, index) => {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
        });
        gsap.set(getCardContent(i), {
          x: xNew,
          zIndex: 40,
          y: offsetTop + cardHeight - 80,
        });
        gsap.set(getSliderItem(i), { 
          x: (index + 1) * numberSize,
          y: 0
        });
      });

      gsap.set(".indicator", { x: -width });

      const startDelay = 0.6;

      gsap.to(".cover", {
        x: width + 400,
        delay: 0.5,
        ease,
        onComplete: () => {
          setTimeout(() => {
            loop();
          }, 500);
        },
      });

      rest.forEach((i, index) => {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.to(getCard(i), {
          x: xNew,
          zIndex: 30,
          delay: 0.05 * index + startDelay,
          ease,
        });
        gsap.to(getCardContent(i), {
          x: xNew,
          zIndex: 40,
          delay: 0.05 * index + startDelay,
          ease,
        });
      });

      gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
      gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
    };

    // Handle window resize
    const handleResize = () => {
      if (isAnimating) return;
      
      updateDimensions();
      const [active, ...rest] = order;
      
      // Update active card
      gsap.set(getCard(active), {
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Update rest of the cards
      rest.forEach((i, index) => {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
        });
        gsap.set(getCardContent(i), {
          x: xNew,
          y: offsetTop + cardHeight - 80,
        });
        gsap.set(getSliderItem(i), { 
          x: (index + 1) * numberSize,
        });
      });

      // Update pagination position
      gsap.set("#pagination", {
        top: offsetTop + cardHeight + 30,
        left: offsetLeft,
      });
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Handle the animation step
    const step = () => {
      if (isAnimating) return;
      isAnimating = true;

      return new Promise((resolve) => {
        order.push(order.shift());
        detailsEven = !detailsEven;

        const detailsActive = detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

        document.querySelector(`${detailsActive} .place-box .text`).textContent =
          data[order[0]].place;
        document.querySelector(`${detailsActive} .title-1`).textContent =
          data[order[0]].title;
        document.querySelector(`${detailsActive} .title-2`).textContent =
          data[order[0]].title2;
        document.querySelector(`${detailsActive} .desc`).textContent =
          data[order[0]].description;

        gsap.set(detailsActive, { zIndex: 22 });
        gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
        gsap.to(`${detailsActive} .text`, {
          y: 0,
          delay: 0.1,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-1`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-2`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .desc`, {
          y: 0,
          delay: 0.3,
          duration: 0.4,
          ease,
        });
        gsap.to(`${detailsActive} .cta`, {
          y: 0,
          delay: 0.35,
          duration: 0.4,
          onComplete: () => {
            isAnimating = false;
            resolve();
          },
          ease,
        });
        gsap.set(detailsInactive, { zIndex: 12 });

        const [active, ...rest] = order;
        const prv = rest[rest.length - 1];

        gsap.set(getCard(prv), { zIndex: 10 });
        gsap.set(getCard(active), { zIndex: 20 });
        gsap.to(getCard(prv), { scale: 1.5, ease });

        gsap.to(getCardContent(active), {
          y: offsetTop + cardHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease,
        });
        gsap.to(getSliderItem(active), { x: 0, ease });
        gsap.to(getSliderItem(prv), { x: -numberSize, ease });
        gsap.to(".progress-sub-foreground", {
          width: 500 * (1 / order.length) * (active + 1),
          ease,
        });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          ease,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          onComplete: () => {
            const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
            gsap.set(getCard(prv), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30,
              borderRadius: 10,
              scale: 1,
            });

            gsap.set(getCardContent(prv), {
              x: xNew,
              y: offsetTop + cardHeight - 80, // Adjusted to match
              opacity: 1,
              zIndex: 40,
            });
            gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

            gsap.set(detailsInactive, { opacity: 0 });
            gsap.set(`${detailsInactive} .text`, { y: 100 });
            gsap.set(`${detailsInactive} .title-1`, { y: 100 });
            gsap.set(`${detailsInactive} .title-2`, { y: 100 });
            gsap.set(`${detailsInactive} .desc`, { y: 50 });
            gsap.set(`${detailsInactive} .cta`, { y: 60 });
            clicks -= 1;
            if (clicks > 0) {
              step();
            }
          },
        });

        rest.forEach((i, index) => {
          if (i !== prv) {
            const xNew = offsetLeft + index * (cardWidth + gap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              ease,
              delay: 0.1 * (index + 1),
            });

            gsap.to(getCardContent(i), {
              x: xNew,
              y: offsetTop + cardHeight - 80, // Match the value
              opacity: 1,
              zIndex: 40,
              ease,
              delay: 0.1 * (index + 1),
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
          }
        });
      });
    };

    // Animation loop with 5-second delay
    const loop = async () => {
      await animate(".indicator", 2, { x: 0 });
      await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
      gsap.set(".indicator", { x: -window.innerWidth });
      await step();
      
      // Wait for 5 seconds before next slide
      await new Promise(resolve => setTimeout(resolve, 5000));
      loop();
    };

    // Load images and start
    const loadImage = async (src) => {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    const loadImages = async () => {
      const promises = data.map(({ image }) => loadImage(image));
      return Promise.all(promises);
    };

    const start = async () => {
      try {
        await loadImages();
        init();
      } catch (error) {
        console.error("One or more images failed to load", error);
      }
    };

    // Populate DOM elements
    if (demoRef.current && slideNumbersRef.current) {
      const cards = data.map((item, index) =>
        `<div class="card" id="card${index}" style="background-image:url(${item.image})"></div>`
      ).join('');

      const cardContents = data.map((item, index) =>
        `<div class="card-content" id="card-content-${index}">
          <div class="content-overlay"></div>
          <div class="content-wrapper">
            <span class="content-place">${item.place}</span>
            <span class="content-title-1">${item.title}</span>
            <span class="content-title-2">${item.title2}</span>
            <div class="content-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.547 4.505a8.25 8.25 0 1011.672 8.214l-.5-.5a2.25 2.25 0 00-3.182 0l-.908.909a2.25 2.25 0 01-3.182 0l-.908-.909a2.25 2.25 0 00-3.182 0l-.5.5zM12 6.75a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6A.75.75 0 0112 6.75z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>`
      ).join('');

      const slideNumbers = data.map((_, index) =>
        `<div class="item" id="slide-item-${index}">${index + 1}</div>`
      ).join('');

      demoRef.current.innerHTML = cards + cardContents;
      slideNumbersRef.current.innerHTML = slideNumbers;

      // Initialize the animation
      start();
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.querySelector('.arrow-right')?.removeEventListener('click', () => { });
      document.querySelector('.arrow-left')?.removeEventListener('click', () => { });
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden font-sans">
      <div className="indicator"></div>

      <div id="demo" ref={demoRef}></div>

      <div className="details" id="details-even">
        <div className="place-box">
          <span className="text">Switzerland Alps</span>
        </div>
        <div className="title-box-1"><span className="title-1">SAINT</span></div>
        <div className="title-box-2"><span className="title-2">ANTONIEN</span></div>
        <div className="desc">
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div>
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="discover" onClick={handleDiscoverClick}>Discover Location</button>
        </div>
      </div>

      <div className="details" id="details-odd">
        <div className="place-box">
          <span className="text">Switzerland Alps</span>
        </div>
        <div className="title-box-1"><span className="title-1">SAINT</span></div>
        <div className="title-box-2"><span className="title-2">ANTONIEN</span></div>
        <div className="desc">
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div>
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="discover" onClick={handleDiscoverClick}>Discover Location</button>
        </div>
      </div>

      <div className="pagination" id="pagination">
        <div className="progress-sub-container">
          <div className="progress-sub-background">
            <div className="progress-sub-foreground"></div>
          </div>
        </div>
        <div className="slide-numbers" id="slide-numbers" ref={slideNumbersRef}></div>
      </div>

      <div className="cover"></div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500&display=swap");
        
        :root {
          --primary-color: #ecad29;
          --text-color: #FFFFFFDD;
          --card-bg: rgba(0, 0, 0, 0.5);
          --hover-bg: rgba(0, 0, 0, 0.7);
        }

        .card {
          position: absolute;
          left: 0;
          top: 0;
          background-position: center;
          background-size: cover;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 16px;
          overflow: hidden;
        }

        .card:hover {
          transform: scale(1.03) translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        #btn {
          position: absolute;
          top: 690px;
          left: 16px;
          z-index: 99;
        }

        .card-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          color: var(--text-color);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .content-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          padding: 1.5rem;
          transform: translateY(0);
          transition: transform 0.3s ease;
        }

        .card:hover .content-overlay {
          opacity: 0.9;
        }

        .card:hover .content-wrapper {
          transform: translateY(-5px);
        }

        .content-place {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 4px;
          opacity: 0.9;
        }

        .content-title-1,
        .content-title-2 {
          font-weight: 600;
          font-size: 16px;
          color: #ffffff;
          font-family: "Oswald", sans-serif;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }

        .content-icon {
          position: absolute;
          bottom: 12px;
          right: 12px;
          color: var(--primary-color);
          opacity: 0.8;
          width: 18px;
          height: 18px;
          transition: all 0.3s ease;
        }

        .card:hover .content-icon {
          transform: scale(1.1);
          opacity: 1;
        }

        .details {
          z-index: 22;
          position: absolute;
          top: 50%;
          left: 5%;
          transform: translateY(-50%);
          width: 90%;
          max-width: 450px;
          background: rgba(0, 0, 0, 0.7);
          // backdrop-filter: blur(20px);
          padding: clamp(1.25rem, 3vw, 2.5rem);
          border-radius: clamp(15px, 2vw, 30px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .details:hover {
          transform: translateY(-50%) translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }

        .details .place-box {
          height: clamp(32px, 4vw, 40px);
          overflow: hidden;
        }

        .details .place-box .text {
          padding-top: clamp(8px, 1.5vw, 12px);
          font-size: clamp(14px, 1.5vw, 18px);
          position: relative;
          color: var(--text-color);
          letter-spacing: 0.5px;
        }

        .details .place-box .text:before {
          top: 0;
          left: 0;
          position: absolute;
          content: "";
          width: 30px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--primary-color), #ffd700);
        }

        .details .title-1,
        .details .title-2 {
          font-size: clamp(32px, 4vw, 48px);
          background: linear-gradient(90deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: none;
          line-height: 1.2;
        }

        .details > .desc {
          width: 100%;
          max-width: 380px;
          font-size: clamp(12px, 1.2vw, 14px);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          margin-top: clamp(0.75rem, 2vw, 1rem);
        }

        .details > .cta {
          width: 100%;
          max-width: 380px;
          margin-top: clamp(1.5rem, 3vw, 2rem);
          display: flex;
          align-items: center;
          gap: clamp(0.5rem, 1.5vw, 1rem);
        }

        .details > .cta > .bookmark {
          width: clamp(35px, 4vw, 45px);
          height: clamp(35px, 4vw, 45px);
          border: none;
          background: linear-gradient(135deg, var(--primary-color), #ffd700);
          border-radius: 50%;
          color: white;
          display: grid;
          place-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(236, 173, 41, 0.3);
        }

        .details > .cta > .bookmark:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 20px rgba(236, 173, 41, 0.4);
        }

        .details > .cta > .discover {
          height: clamp(35px, 4vw, 45px);
          padding: 0 clamp(20px, 3vw, 32px);
          font-size: clamp(12px, 1.2vw, 14px);
          border: 2px solid rgba(255, 255, 255, 0.8);
          background: transparent;
          border-radius: 50px;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.3s ease;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }

        .details > .cta > .discover:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), #ffd700);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .details > .cta > .discover:hover {
          border-color: transparent;
          color: #000;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .details > .cta > .discover:hover:before {
          opacity: 1;
        }

        .indicator {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 4px;
          z-index: 60;
          background: linear-gradient(90deg, var(--primary-color), #ffd700);
        }

        .pagination {
          position: absolute;
          left: 0px;
          top: 0px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }

        .pagination > .arrow {
          z-index: 60;
          width: 50px;
          height: 50px;
          border-radius: 999px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: grid;
          place-items: center;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
        }

        .pagination > .arrow:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .pagination > .arrow:nth-child(2) {
          margin-left: 0;
        }

        .pagination > .arrow svg {
          width: 24px;
          height: 24px;
          stroke-width: 2;
          color: #ffffff;
        }

        .pagination .progress-sub-container {
          margin-left: 0;
          z-index: 60;
          width: 500px;
          height: 50px;
          display: flex;
          align-items: center;
        }

        .pagination .progress-sub-container .progress-sub-background {
          width: 500px;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .pagination .progress-sub-container .progress-sub-background .progress-sub-foreground {
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), #ffd700);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .pagination .slide-numbers {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          z-index: 60;
          position: relative;
        }

        .pagination .slide-numbers .item {
          width: 50px;
          height: 50px;
          position: relative;
          color: white;
          display: grid;
          place-items: center;
          font-size: 24px;
          font-weight: bold;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          border-radius: 25px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          margin-right: 10px;
        }

        .cover {
          position: absolute;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
          z-index: 100;
        }

        @media (max-width: 768px) {
          .details {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
            padding: clamp(1rem, 3vw, 1.5rem);
          }

          .details:hover {
            transform: translate(-50%, -50%) translateY(-5px);
          }

          .details > .cta {
            flex-direction: column;
            gap: 12px;
          }

          .details > .cta > .discover {
            width: 100%;
            margin-left: 0;
          }
        }

        @media (max-width: 480px) {
          .details {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 85%;
            max-width: 320px;
            padding: clamp(0.75rem, 2vw, 1rem);
          }

          .details:hover {
            transform: translate(-50%, -50%) translateY(-5px);
          }
        }

        @media (max-height: 600px) {
          .details {
            top: 50%;
            padding: clamp(0.75rem, 2vw, 1.25rem);
          }

          .details .title-1,
          .details .title-2 {
            font-size: clamp(28px, 3vw, 36px);
          }

          .details > .desc {
            margin-top: 0.5rem;
            line-height: 1.4;
          }

          .details > .cta {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TravelDestinationSlider;