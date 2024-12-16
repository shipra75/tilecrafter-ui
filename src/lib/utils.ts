import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function addLayerForGeometryType(map, value, geometryType) {
    // Map geometry types to layer types
    const layerTypeMap = {
        Point: "circle",
        MultiPoint: "circle",
        LineString: "line",
        MultiLineString: "line",
        Polygon: "fill",
        MultiPolygon: "fill",
    };

    // Determine the layer type based on the geometryType
    // Default to "fill" if the geometry type is not recognized
    const layerType = layerTypeMap[geometryType] || "fill";

    // Add the layer to the map
    map.addLayer({
        id: `${value}-${geometryType}`,
        type: layerType,
        source: value,
        paint: {
            // Customize paint properties as needed
            ...(layerType === "fill" && { "fill-color": "#088", "fill-opacity": 0.4 }),
            ...(layerType === "line" && { "line-color": "#f00", "line-width": 2 }),
            ...(layerType === "circle" && { "circle-color": "#00f", "circle-radius": 5 }),
        },
    });
}