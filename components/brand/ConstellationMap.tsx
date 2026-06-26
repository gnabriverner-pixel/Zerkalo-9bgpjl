/**
 * ConstellationMap — premium pentagon radial layout for 5 formula positions.
 * Uses react-native-svg. Each node sits at one of 5 pentagon vertices.
 * Subtle connecting lines radiate from center; active node glows.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { PLANET_COLORS, PLANET_NAMES } from '@/constants/theme';

// ── types ──────────────────────────────────────────────────────────────────────

interface Node {
  key: string;
  label: string;
  number: number;
  composite?: number;
}

interface ConstellationMapProps {
  nodes: Node[];
  size?: number;
}

// ── geometry ───────────────────────────────────────────────────────────────────

// Pentagon vertices, starting from top, going clockwise
function pentagonPoints(cx: number, cy: number, r: number): { x: number; y: number }[] {
  return Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

// ── component ─────────────────────────────────────────────────────────────────

export function ConstellationMap({ nodes, size = 320 }: ConstellationMapProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.36;
  const innerR = size * 0.12;

  const pts = pentagonPoints(cx, cy, outerR);

  return (
    <Animated.View style={[styles.wrap, { width: size, height: size, opacity: fadeAnim }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer orbit circle */}
        <Circle
          cx={cx} cy={cy} r={outerR + 22}
          stroke="rgba(216,179,106,0.08)"
          strokeWidth={1}
          fill="none"
        />
        {/* Mid orbit */}
        <Circle
          cx={cx} cy={cy} r={outerR}
          stroke="rgba(216,179,106,0.06)"
          strokeWidth={0.5}
          fill="none"
          strokeDasharray="4,8"
        />
        {/* Inner orbit */}
        <Circle
          cx={cx} cy={cy} r={innerR + 10}
          stroke="rgba(216,179,106,0.10)"
          strokeWidth={0.8}
          fill="none"
        />
        {/* Center sigil */}
        <Circle cx={cx} cy={cy} r={3} fill="rgba(216,179,106,0.6)" />
        <Circle cx={cx} cy={cy} r={8} stroke="rgba(216,179,106,0.18)" strokeWidth={0.8} fill="none" />

        {/* Lines from center to each node */}
        {pts.map((p, i) => (
          <Line
            key={`line-${i}`}
            x1={cx} y1={cy}
            x2={p.x} y2={p.y}
            stroke="rgba(216,179,106,0.12)"
            strokeWidth={0.8}
          />
        ))}

        {/* Pentagon outline */}
        {pts.map((p, i) => {
          const next = pts[(i + 1) % 5];
          return (
            <Line
              key={`edge-${i}`}
              x1={p.x} y1={p.y}
              x2={next.x} y2={next.y}
              stroke="rgba(216,179,106,0.10)"
              strokeWidth={0.6}
            />
          );
        })}

        {/* Nodes */}
        {nodes.slice(0, 5).map((node, i) => {
          const p = pts[i];
          const color = PLANET_COLORS[node.number] || '#D8B36A';
          const showComp = node.composite !== undefined && node.composite !== node.number;

          return (
            <G key={node.key}>
              {/* Glow halo */}
              <Circle cx={p.x} cy={p.y} r={22} fill={color} opacity={0.06} />
              {/* Outer ring */}
              <Circle cx={p.x} cy={p.y} r={18} stroke={color} strokeWidth={0.8} fill="rgba(9,9,9,0.95)" opacity={0.9} />
              {/* Inner fill */}
              <Circle cx={p.x} cy={p.y} r={15} fill={color} opacity={0.12} />

              {/* Number */}
              <SvgText
                x={p.x} y={p.y + (showComp ? 1 : 5)}
                textAnchor="middle"
                fill={color}
                fontSize={showComp ? 14 : 17}
                fontWeight="700"
              >
                {node.number}
              </SvgText>

              {/* Composite sub-number */}
              {showComp ? (
                <SvgText
                  x={p.x} y={p.y + 13}
                  textAnchor="middle"
                  fill={color}
                  fontSize={8}
                  opacity={0.7}
                >
                  {node.composite}
                </SvgText>
              ) : null}

              {/* Label below node */}
              <SvgText
                x={p.x} y={p.y + 30}
                textAnchor="middle"
                fill="rgba(244,239,228,0.55)"
                fontSize={8}
                letterSpacing={0.5}
              >
                {node.label.replace('Число ', '')}
              </SvgText>

              {/* Planet dot */}
              <Circle cx={p.x} cy={p.y - 23} r={2.5} fill={color} opacity={0.65} />
            </G>
          );
        })}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
});
