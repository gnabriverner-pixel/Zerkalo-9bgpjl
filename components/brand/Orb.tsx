/**
 * Orb — Yantric SVG orb component
 * Native analog of Lovable's Orb visual:
 * - Central sphere with radial gradient
 * - Rotating yantric rings and squares at 45°
 * - Soft breathing glow (opacity 0.6 → 0.9 animation)
 *
 * Usage: <Orb color={Colors.venus} size={120} />
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop, Rect, G } from 'react-native-svg';

interface OrbProps {
  color: string;
  size?: number;
  /** Slows down rotation for resting state. Default: 12000ms */
  rotationDuration?: number;
  /** Show outer decorative rings. Default: true */
  showRings?: boolean;
}

export function Orb({ color, size = 100, rotationDuration = 12000, showRings = true }: OrbProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const rotationReverse = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Continuous rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: rotationDuration,
        useNativeDriver: true,
      })
    ).start();

    // Reverse for second ring
    Animated.loop(
      Animated.timing(rotationReverse, {
        toValue: 1,
        duration: rotationDuration * 1.6,
        useNativeDriver: true,
      })
    ).start();

    // Breathing glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 0.9,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0.55,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spinReverse = rotationReverse.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const cx = size / 2;
  const coreR = size * 0.28;
  const mid = size * 0.38;
  const outerR = size * 0.46;

  // Hex color to rgb for gradient stops
  const gradId = `orbGrad_${color.replace('#', '').replace(/,/g, '_').replace(/\./g, '_').replace(/\(/g, '_').replace(/\)/g, '_')}`;
  const dimColor = color + '30';

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      {/* Breathing outer glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.4,
            height: size * 1.4,
            borderRadius: (size * 1.4) / 2,
            backgroundColor: color,
            opacity: breathe,
            left: -(size * 0.2),
            top: -(size * 0.2),
          },
        ]}
      />

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id={gradId} cx="40%" cy="35%" r="65%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <Stop offset="45%" stopColor={color} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.08} />
          </RadialGradient>
        </Defs>

        {/* Outer aura ring */}
        {showRings ? (
          <Circle
            cx={cx} cy={cx} r={outerR + 4}
            fill="none"
            stroke={color}
            strokeWidth={0.5}
            strokeOpacity={0.18}
          />
        ) : null}

        {/* Core sphere */}
        <Circle cx={cx} cy={cx} r={coreR} fill={`url(#${gradId})`} />

        {/* Inner highlight */}
        <Circle
          cx={cx - coreR * 0.2}
          cy={cx - coreR * 0.25}
          r={coreR * 0.35}
          fill={color}
          opacity={0.18}
        />
      </Svg>

      {/* Rotating yantric outer ring */}
      {showRings ? (
        <Animated.View
          style={[
            styles.ring,
            {
              width: size * 0.94,
              height: size * 0.94,
              borderRadius: (size * 0.94) / 2,
              borderColor: color + '22',
              borderWidth: 0.8,
              left: size * 0.03,
              top: size * 0.03,
              transform: [{ rotate: spin }],
            },
          ]}
        />
      ) : null}

      {/* Rotating yantric square (rotated 45°) */}
      {showRings ? (
        <Animated.View
          style={[
            styles.square,
            {
              width: size * 0.66,
              height: size * 0.66,
              borderColor: color + '1A',
              borderWidth: 0.7,
              left: size * 0.17,
              top: size * 0.17,
              transform: [{ rotate: spinReverse }, { rotateZ: '45deg' }],
            },
          ]}
        />
      ) : null}

      {/* Counter-rotating mid ring */}
      {showRings ? (
        <Animated.View
          style={[
            styles.ring,
            {
              width: size * 0.78,
              height: size * 0.78,
              borderRadius: (size * 0.78) / 2,
              borderColor: color + '15',
              borderWidth: 1,
              borderStyle: 'dashed',
              left: size * 0.11,
              top: size * 0.11,
              transform: [{ rotate: spinReverse }],
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    // Very faint radial glow effect via bg color + low opacity
    opacity: 0.06,
  },
  ring: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  square: {
    position: 'absolute',
    borderStyle: 'solid',
  },
});
