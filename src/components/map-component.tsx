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
        style: `https://tiles.olamaps.io/styles/default-light-standard/style.json`,
        center: [0, 0],
        zoom: 1
      })
    }
  }, [])

  useEffect(() => {
    fetchDatasets()
  }, [])

  const fetchDatasets = async () => {
    try {
      setLoading(true)
      const data = await api.datasets.getAll("generated")
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
      const tilesetData = await api.tiles.getTileSet(dataset.datasetName, "pbf", true, "https://ani-maps-tilecrafter-backend-8080a.stg.corp.olacabs.com").catch(() => null)
      console.log('tilesetData ', tilesetData )
      if (!tilesetData || !tilesetData.tiles?.length) return
      addDatasetLayer(dataset.datasetName, tilesetData)
    } else {
      removeDatasetLayer(dataset.datasetName)
    }
  }

  const addDatasetLayer = (name: string, tiles: any) => {
    console.log('map', map)
    if (!map.current) return
    const sourceId = `source-${name}`
    const layerId = `layer-${name}`
    console.log(' tiles 4363',  tiles)
    if (!map.current.getSource(sourceId)) {
      const source = map.current.addSource(sourceId, {
        type: 'vector',
        tiles: tiles.tiles,
        minzoom: 0,
        maxzoom: 12,
      })
      console.log('source1234', source)
    }

    if (!map.current.getLayer(layerId)) {
    console.log('layerId', layerId)
     const layer = map.current.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      "source-layer": tiles.vector_layers[0].id, 
      paint: {
        'line-color': '#EF4444',
        'line-width': 2
      },
      layout: {
        visibility: 'visible'
      },
      
    });
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