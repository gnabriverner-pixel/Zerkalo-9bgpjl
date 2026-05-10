import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Circle, Line } from 'react-native-svg';
import { Colors } from '@/constants/theme';

interface MirrorSymbolProps {
  size?: number;
  /** Show orbiting number sigil dots */
  showSigils?: boolean;
}

const SIGIL_POSITIONS = [
  { cx: 0.5,  cy: 0.08,  r: 3 },
  { cx: 0.82, cy: 0.22,  r: 2.5 },
  { cx: 0.88, cy: 0.5,   r: 2 },
  { cx: 0.78, cy: 0.78,  r: 2.5 },
  { cx: 0.5,  cy: 0.92,  r: 3 },
  { cx: 0.22, cy: 0.78,  r: 2.5 },
  { cx: 0.12, cy: 0.5,   r: 2 },
  { cx: 0.18, cy: 0.22,  r: 2.5 },
  { cx: 0.5,  cy: 0.5,   r: 1.5 },
];

export function MirrorSymbol({ size = 240, showSigils = true }: MirrorSymbolProps) {
  const w = size;
  const h = size * 1.2;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w * 0.44;
  const ry = h * 0.46;

  const goldPrimary = Colors.gold;
  const goldDim = 'rgba(216,179,106,0.25)';
  const goldFaint = 'rgba(216,179,106,0.10)';
  const goldGlow = 'rgba(216,179,106,0.06)';

  return (
    <View style={[styles.container, { width: w, height: h }]}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Outermost faint ring */}
        <Ellipse
          cx={cx} cy={cy}
          rx={rx + 32} ry={ry + 32}
          fill="none"
          stroke={goldGlow}
          strokeWidth={1}
        />
        {/* Outer orbit ring */}
        <Ellipse
          cx={cx} cy={cy}
          rx={rx + 20} ry={ry + 20}
          fill="none"
          stroke={goldFaint}
          strokeWidth={0.8}
          strokeDasharray="2 6"
        />
        {/* Inner orbit ring */}
        <Ellipse
          cx={cx} cy={cy}
          rx={rx + 8} ry={ry + 8}
          fill="none"
          stroke={goldDim}
          strokeWidth={0.6}
        />
        {/* Mirror body — subtle fill */}
        <Ellipse
          cx={cx} cy={cy}
          rx={rx} ry={ry}
          fill="rgba(216,179,106,0.04)"
          stroke={goldPrimary}
          strokeWidth={1}
          strokeOpacity={0.5}
        />
        {/* Inner glow ellipse */}
        <Ellipse
          cx={cx} cy={cy}
          rx={rx * 0.65} ry={ry * 0.65}
          fill="none"
          stroke={goldFaint}
          strokeWidth={0.5}
        />
        {/* Cross-hair lines */}
        <Line
          x1={cx - rx * 0.4} y1={cy}
          x2={cx + rx * 0.4} y2={cy}
          stroke={goldDim} strokeWidth={0.5}
        />
        <Line
          x1={cx} y1={cy - ry * 0.4}
          x2={cx} y2={cy + ry * 0.4}
          stroke={goldDim} strokeWidth={0.5}
        />
        {/* Sigil dots on outer orbit */}
        {showSigils ? SIGIL_POSITIONS.map((s, i) => {
          const orbitRx = rx + 20;
          const orbitRy = ry + 20;
          // Evenly space around ellipse
          const angle = (i / SIGIL_POSITIONS.length) * Math.PI * 2 - Math.PI / 2;
          const sx = cx + orbitRx * Math.cos(angle);
          const sy = cy + orbitRy * Math.sin(angle);
          return (
            <Circle
              key={i}
              cx={sx} cy={sy}
              r={s.r}
              fill={goldPrimary}
              opacity={0.6}
            />
          );
        }) : null}
        {/* Center point */}
        <Circle cx={cx} cy={cy} r={2} fill={goldPrimary} opacity={0.4} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
