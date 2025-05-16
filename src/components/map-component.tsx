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
        zoom: 1,
      })
      map.current.on('load', () => {
        console.log('Map is ready');
      });
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
    if (map.current) {
      map.current.remove(); // destroy old map instance
      map.current = null;
    }
    if (mapContainer.current) {
      const newMap = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.olamaps.io/styles/default-light-standard/style.json',
        center: [0, 0],
        zoom: 1,
      });
  
      newMap.on('load', async () => {
        map.current = newMap;
        console.log('Map reloaded');
    const updated = datasets.map((d) => d.datasetName === dataset.datasetName ? { ...d, visible: !d.visible } : d)
    setDatasets(updated)

    if (!dataset.visible) {
      // Turn on: Add source/layer
 
      const tilesetData = await api.tiles.getTileSet(dataset.datasetName, "json", true, "http://localhost:3001").catch(() => null)
      console.log('tilesetData ', tilesetData )
      if (!tilesetData || !tilesetData.tiles?.length) return
      addDatasetLayer(newMap, dataset.datasetName, tilesetData.tiles)
    } else {
      removeDatasetLayer(dataset.datasetName)
    }
  }
      )}
}

  const addDatasetLayer = (mapIntance: any, name: string, tiles: string[]) => {
    if (!mapIntance.current) return
    const sourceId = `source-${name}`
    const layerId = `layer-${name}`

    if (!mapIntance.current.getSource(sourceId)) {
    console.log('map.current', map.current)
     const source = mapIntance.current.addSource(sourceId, {
        type: 'vector',
        tiles,
        minzoom: 0,
        maxzoom: 14,
      })
  console.log('source',source)
    }
console.log('layerId', layerId)
    if (!mapIntance.current.getLayer(layerId)) {
     const layer =  mapIntance.current.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        'source-layer': 'data',
        paint: {
          'fill-color': '#1D4ED8',
          'fill-opacity': 0.6
        },
        minzoom: 0,
        maxzoom: 14,
      })
      console.log('layer', layer)
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
