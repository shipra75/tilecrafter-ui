'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Button } from "@/components/ui/button"
import { api } from '../utils/api'
import { toast } from "@/components/ui/use-toast"

export function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const [datasets, setDatasets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api-stg-corp.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=bf6c4c66aad74a6e8ed0d816245d314c`,
        center: [0, 0],
        zoom: 1,
      })
    }
  }, [])

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const data = await api.datasets.getAll("uploaded")
      setDatasets(data.map((d: any) => ({ ...d, visible: false })))
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch datasets", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const toggleDataset = async (dataset: any) => {
    const updated = datasets.map((d) => d.datasetName === dataset.datasetName ? { ...d, visible: !d.visible } : d)
    setDatasets(updated)

    if (!dataset.visible) {
      // Turn on: Add source/layer
      const tilesetData = await api.tiles.getTileSet(dataset.datasetName, "json", true, "http://localhost:3000").catch(() => null)
      if (!tilesetData || !tilesetData.tiles?.length) return
      addDatasetLayer(dataset.datasetName, tilesetData.tiles)
    } else {
      removeDatasetLayer(dataset.datasetName)
    }
  }

  const addDatasetLayer = (name: string, tiles: string[]) => {
    if (!map.current) return
    const sourceId = `source-${name}`
    const layerId = `layer-${name}`

    if (!map.current.getSource(sourceId)) {
      map.current.addSource(sourceId, {
        type: 'vector',
        tiles,
        minzoom: 0,
        maxzoom: 14,
      })
    }

    if (!map.current.getLayer(layerId)) {
      map.current.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        'source-layer': 'data',
        paint: {
          'fill-color': '#1D4ED8',
          'fill-opacity': 0.6
        }
      })
    }
  }

  const removeDatasetLayer = (name: string) => {
    if (!map.current) return
    const sourceId = `source-${name}`
    const layerId = `layer-${name}`

    if (map.current.getLayer(layerId)) map.current.removeLayer(layerId)
    if (map.current.getSource(sourceId)) map.current.removeSource(sourceId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button onClick={fetchDatasets} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Datasets'}
        </Button>
      </div>
      <ul className="space-y-2">
        {datasets.map((d) => (
          <li key={d.datasetName} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={d.visible}
              onChange={() => toggleDataset(d)}
            />
            <span>{d.datasetName}</span>
          </li>
        ))}
      </ul>
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg overflow-hidden" />
    </div>
  )
}
