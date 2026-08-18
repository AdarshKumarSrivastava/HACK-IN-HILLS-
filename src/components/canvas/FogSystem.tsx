/* eslint-disable react-hooks/purity */
'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Generate a soft cloud/fog texture programmatically
function createFogTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function FogLayers() {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  const fogTexture = useMemo(() => createFogTexture(), [])

  // Create random fog clusters
  const fogs = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      x: (Math.random() - 0.5) * viewport.width * 1.5,
      y: (Math.random() - 0.5) * viewport.height * 0.5 - viewport.height * 0.2, // bias towards bottom
      z: Math.random() * 4 - 2, // Layering depth
      scale: Math.random() * 4 + 4,
      opacity: Math.random() * 0.4 + 0.1,
      speed: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1)
    }))
  }, [viewport])

  useFrame((state) => {
    if (!groupRef.current || document.visibilityState === 'hidden') return
    const time = state.clock.getElapsedTime()
    
    // Add slow drift to fog
    groupRef.current.children.forEach((child, i) => {
      const fogData = fogs[i]
      child.position.x += fogData.speed
      // Wrap around
      if (child.position.x > viewport.width) child.position.x = -viewport.width
      if (child.position.x < -viewport.width) child.position.x = viewport.width
      
      // Gentle pulsing opacity
      if (child instanceof THREE.Sprite) {
        child.material.opacity = fogData.opacity + Math.sin(time + i) * 0.05
      }
    })
  })

  return (
    <group ref={groupRef}>
      {fogs.map((fog, i) => (
        <sprite key={i} position={[fog.x, fog.y, fog.z]} scale={[fog.scale, fog.scale, 1]}>
          <spriteMaterial 
            map={fogTexture} 
            color="#ffffff" 
            transparent 
            opacity={fog.opacity}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}

export default function FogSystem() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <FogLayers />
      </Canvas>
    </div>
  )
}
