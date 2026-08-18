/* eslint-disable react-hooks/purity */
'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function SnowParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  // Generate particles
  const [positions, scales, speeds] = useMemo(() => {
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 150 : 500
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const speeds = new Float32Array(count * 2) // speedX, speedY

    for (let i = 0; i < count; i++) {
      // Distribute randomly across the viewport
      positions[i * 3] = (Math.random() - 0.5) * viewport.width * 1.5
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5
      
      // Z-depth distribution for parallax effect
      // Closer particles (higher Z) move faster and appear larger
      const z = Math.random() * 5 - 2.5
      positions[i * 3 + 2] = z
      
      scales[i] = Math.random() * 0.05 + 0.02
      
      // Speed varies based on z-depth
      const zFactor = (z + 2.5) / 5 // 0 to 1
      speeds[i * 2] = (Math.random() - 0.5) * 0.01 * (zFactor + 0.5) // X speed
      speeds[i * 2 + 1] = (Math.random() * 0.02 + 0.01) * (zFactor + 0.5) // Y speed
    }

    return [positions, scales, speeds]
  }, [viewport])

  const mouseX = useRef(0)
  
  useFrame((state) => {
    if (document.visibilityState === 'hidden') return
    
    // Subtle mouse interaction
    if (state.pointer) {
      // Smooth out mouse movement
      mouseX.current += (state.pointer.x - mouseX.current) * 0.05
    }

    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < positions.length / 3; i++) {
        // Base falling
        positions[i * 3 + 1] -= speeds[i * 2 + 1]
        
        // Wind + Mouse influence
        const zDepth = positions[i * 3 + 2]
        const zFactor = (zDepth + 2.5) / 5
        const wind = mouseX.current * 0.02 * zFactor
        
        positions[i * 3] += speeds[i * 2] + wind

        // Reset if out of bounds
        if (positions[i * 3 + 1] < -viewport.height / 2) {
          positions[i * 3 + 1] = viewport.height / 2
          positions[i * 3] = (Math.random() - 0.5) * viewport.width * 1.5
        }
        
        if (positions[i * 3] > viewport.width) {
          positions[i * 3] -= viewport.width * 2
        } else if (positions[i * 3] < -viewport.width) {
          positions[i * 3] += viewport.width * 2
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function SnowSystem() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <SnowParticles />
      </Canvas>
    </div>
  )
}
