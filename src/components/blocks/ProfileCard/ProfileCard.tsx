/*
	Installed from https://reactbits.dev/ts/default/
	Enhanced with device orientation support for mobile - TypeScript fixed
*/

import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import './ProfileCard.css';

interface ProfileCardProps {
  avatarUrl?: string; // Changed to optional to align with schema.prisma
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

// Type for DeviceOrientationEvent with permission API
interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

// Type for DeviceOrientationEvent constructor with permission
interface DeviceOrientationEventConstructor {
  new(): DeviceOrientationEventWithPermission;
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
}

const DEFAULT_BEHIND_GRADIENT =
  'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';

const DEFAULT_INNER_GRADIENT =
  'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

// Base64 fallback grain texture (small, repeating pattern)
const FALLBACK_GRAIN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAAQGU/a4AAAAeSURBVHjaY2BgYGZmZmZmZGRkZGRkZGRgYGBgYGAAAJ4ACa0CJRkAAAAASUVORK5CYII=';

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
} as const;

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// Device orientation detection
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768 && 'ontouchstart' in window);
};

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl,
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = '',
  enableTilt = true,
  miniAvatarUrl,
  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDeviceOrientationSupported, setIsDeviceOrientationSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Check for mobile device and device orientation support
  useEffect(() => {
    const checkMobile = isMobile();
    setIsMobileDevice(checkMobile);
    
    if (checkMobile && typeof window !== 'undefined') {
      // Check if DeviceOrientationEvent is supported
      if ('DeviceOrientationEvent' in window) {
        setIsDeviceOrientationSupported(true);
        
        // Request permission for iOS 13+
        const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor;
        if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
          // iOS 13+ requires permission
          setPermissionGranted(false);
        } else {
          // Android or older iOS
          setPermissionGranted(true);
        }
      }
    }
  }, []);

  // Request permission for device orientation on iOS
  const requestOrientationPermission = useCallback(async () => {
    const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor;
    if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEventTyped.requestPermission();
        setPermissionGranted(permission === 'granted');
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionGranted(false);
      }
    }
  }, []);

  const updateCardTransform = useCallback((
    offsetX: number,
    offsetY: number,
    card: HTMLElement,
    wrap: HTMLElement
  ) => {
    const width = card.clientWidth;
    const height = card.clientHeight;

    const percentX = clamp((100 / width) * offsetX);
    const percentY = clamp((100 / height) * offsetY);

    const centerX = percentX - 50;
    const centerY = percentY - 50;

    const properties = {
      '--pointer-x': `${percentX}%`,
      '--pointer-y': `${percentY}%`,
      '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
      '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
      '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      '--pointer-from-top': `${percentY / 100}`,
      '--pointer-from-left': `${percentX / 100}`,
      '--rotate-x': `${round(-(centerX / 5))}deg`,
      '--rotate-y': `${round(centerY / 4)}deg`,
    };

    Object.entries(properties).forEach(([property, value]) => {
      wrap.style.setProperty(property, value);
    });
  }, []);

  // Device orientation handler
  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !enableTilt) return;

    // Get orientation values
    const gamma = event.gamma || 0; // Left-right tilt (-90 to 90)
    const beta = event.beta || 0;   // Front-back tilt (-180 to 180)

    // Convert orientation to card position
    // Gamma: -90 (left) to 90 (right) -> 0% to 100%
    // Beta: -45 (back) to 45 (front) -> 0% to 100%
    const percentX = clamp(adjust(gamma, -45, 45, 0, 100));
    const percentY = clamp(adjust(beta, -30, 30, 0, 100));

    // Convert to pixel coordinates
    const offsetX = (percentX / 100) * card.clientWidth;
    const offsetY = (percentY / 100) * card.clientHeight;

    updateCardTransform(offsetX, offsetY, card, wrap);
  }, [enableTilt, updateCardTransform]);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, [enableTilt, updateCardTransform]);

  // Desktop mouse handlers
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      // Only use mouse/touch on desktop or when device orientation is not available
      if (isMobileDevice && isDeviceOrientationSupported && permissionGranted) return;

      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [isMobileDevice, isDeviceOrientationSupported, permissionGranted, updateCardTransform, animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    // Only use mouse/touch on desktop or when device orientation is not available
    if (isMobileDevice && isDeviceOrientationSupported && permissionGranted) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [isMobileDevice, isDeviceOrientationSupported, permissionGranted, animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      // Only use mouse/touch on desktop or when device orientation is not available
      if (isMobileDevice && isDeviceOrientationSupported && permissionGranted) return;

      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove('active');
      card.classList.remove('active');
    },
    [isMobileDevice, isDeviceOrientationSupported, permissionGranted, animationHandlers]
  );

  // Setup event listeners
  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    // Setup device orientation for mobile
    if (isMobileDevice && isDeviceOrientationSupported && permissionGranted) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
      
      // Set initial state for mobile
      wrap.classList.add('active');
      card.classList.add('active');
      
      // Center the card initially
      const initialX = wrap.clientWidth / 2;
      const initialY = wrap.clientHeight / 2;
      updateCardTransform(initialX, initialY, card, wrap);
    } else {
      // Setup mouse/touch events for desktop
      const pointerMoveHandler = handlePointerMove as EventListener;
      const pointerEnterHandler = handlePointerEnter as EventListener;
      const pointerLeaveHandler = handlePointerLeave as EventListener;

      card.addEventListener('pointerenter', pointerEnterHandler);
      card.addEventListener('pointermove', pointerMoveHandler);
      card.addEventListener('pointerleave', pointerLeaveHandler);

      // Initial animation for desktop
      const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
      const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

      updateCardTransform(initialX, initialY, card, wrap);
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.INITIAL_DURATION,
        initialX,
        initialY,
        card,
        wrap
      );

      return () => {
        card.removeEventListener('pointerenter', pointerEnterHandler);
        card.removeEventListener('pointermove', pointerMoveHandler);
        card.removeEventListener('pointerleave', pointerLeaveHandler);
        animationHandlers.cancelAnimation();
      };
    }

    return () => {
      if (isMobileDevice && isDeviceOrientationSupported && permissionGranted) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    isMobileDevice,
    isDeviceOrientationSupported,
    permissionGranted,
    animationHandlers,
    handleDeviceOrientation,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    updateCardTransform,
  ]);

  useEffect(() => {
    if (grainUrl && typeof window !== 'undefined') {
      const img = new Image();
      img.src = grainUrl;
      img.onload = () => {
        console.log(`Grain texture loaded successfully at ${grainUrl}`);
      };
      img.onerror = () => {
        console.error(`Failed to load grain texture at ${grainUrl}`);
      };
    }
  }, [grainUrl]);

  const cardStyle = useMemo(
    () =>
      ({
        '--icon': iconUrl ? `url(${iconUrl})` : 'none',
        '--grain': grainUrl ? `url(${grainUrl})` : `url(${FALLBACK_GRAIN})`,
        '--behind-gradient': showBehindGradient
          ? (behindGradient || DEFAULT_BEHIND_GRADIENT)
          : 'none',
        '--inner-gradient': innerGradient || DEFAULT_INNER_GRADIENT,
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  // Handle permission request for iOS
  const handleCardClick = useCallback(async () => {
    if (isMobileDevice && isDeviceOrientationSupported && !permissionGranted) {
      await requestOrientationPermission();
    }
  }, [isMobileDevice, isDeviceOrientationSupported, permissionGranted, requestOrientationPermission]);

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
      onClick={handleCardClick}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            {/* Conditionally render main avatar image only if avatarUrl is a non-empty string */}
            {avatarUrl && (
              // Using <img> for simplicity, as the avatars are small and lazy-loaded
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="avatar"
                src={avatarUrl}
                alt={`${name || 'User'} avatar`}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    {/* Conditionally render mini avatar image only if miniAvatarUrl or avatarUrl is a non-empty string */}
                    {(miniAvatarUrl || avatarUrl) && (
                      // Using <img> for simplicity, as the avatars are small and lazy-loaded
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name || 'User'} mini avatar`}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '0.5';
                          if (avatarUrl) target.src = avatarUrl;
                        }}
                      />
                    )}
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button
                  className="pc-contact-btn"
                  onClick={handleContactClick}
                  style={{ pointerEvents: 'auto' }}
                  type="button"
                  aria-label={`Contact ${name || 'user'}`}
                >
                  {contactText}
                </button>
              </div>
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
        
        {/* Permission prompt for iOS */}
        {isMobileDevice && isDeviceOrientationSupported && !permissionGranted && (
          <div className="pc-permission-prompt">
            <div className="pc-permission-text">
              Tap to enable device motion
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;