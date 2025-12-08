"use client"

interface CustomDesign {
  backgroundColor: string
  pattern: string
  cardTitle: string
  titleFont: string
  titleSize: number
  titleColor: string
  titleAlign: string
  titlePosition: string
  isBold: boolean
  isItalic: boolean
  uploadedImage: string | null
  imagePosition: { x: number; y: number }
  imageScale: number
  imageFitMode: string
}

interface CustomCardPreviewProps {
  customDesign: CustomDesign
  className?: string
}

function CustomCardPreview({ customDesign, className = "" }: CustomCardPreviewProps) {
  const {
    backgroundColor,
    pattern,
    cardTitle,
    titleFont,
    titleSize,
    titleColor,
    titleAlign,
    titlePosition,
    isBold,
    isItalic,
    uploadedImage,
    imagePosition,
    imageScale,
    imageFitMode,
  } = customDesign

  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }
      case "stripes":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)`,
        }
      case "confetti":
        return {
          backgroundImage: `radial-gradient(circle at 20% 30%, #F6664C33 2px, transparent 2px),
                           radial-gradient(circle at 80% 20%, #185F7233 2px, transparent 2px),
                           radial-gradient(circle at 40% 70%, #FFD70033 2px, transparent 2px),
                           radial-gradient(circle at 70% 80%, #F6664C33 2px, transparent 2px),
                           radial-gradient(circle at 10% 60%, #185F7233 2px, transparent 2px)`,
          backgroundSize: "100px 100px",
        }
      case "hearts":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fontSize='12' fill='%23F6664C33'%3E♥%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }
      case "stars":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fontSize='12' fill='%23FFD70066'%3E★%3C/text%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }
      default:
        return {}
    }
  }

  const getImageStyle = () => {
    switch (imageFitMode) {
      case "fill":
        return { objectFit: "cover" as const, width: "100%", height: "100%" }
      case "fit":
        return { objectFit: "contain" as const, width: "90%", height: "90%", margin: "auto" }
      case "cover":
        return { objectFit: "cover" as const, width: "100%", height: "100%" }
      case "custom":
        return {
          objectFit: "contain" as const,
          transform: `translate(${imagePosition.x - 50}%, ${imagePosition.y - 50}%) scale(${imageScale / 100})`,
        }
      default:
        return { objectFit: "cover" as const, width: "100%", height: "100%" }
    }
  }

  const getTitlePositionClass = () => {
    switch (titlePosition) {
      case "top":
        return "top-4"
      case "center":
        return "top-1/2 -translate-y-1/2"
      case "bottom":
        return "bottom-4"
      default:
        return "bottom-4"
    }
  }

  const fontFamilyMap: Record<string, string> = {
    serif: "Georgia, serif",
    "sans-serif": "Arial, sans-serif",
    cursive: "cursive",
    fantasy: "fantasy",
    monospace: "monospace",
    display: "'Comic Sans MS', cursive",
  }

  return (
    <div
      className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}
      style={{
        backgroundColor,
        ...getPatternStyle(),
      }}
    >
      {uploadedImage && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img src={uploadedImage || "/placeholder.svg"} alt="Custom card" style={getImageStyle()} />
        </div>
      )}

      {cardTitle && (
        <div
          className={`absolute left-0 right-0 px-3 ${getTitlePositionClass()}`}
          style={{
            textAlign: titleAlign as "left" | "center" | "right",
          }}
        >
          <span
            style={{
              fontFamily: fontFamilyMap[titleFont] || "Arial, sans-serif",
              fontSize: `${Math.max(titleSize * 0.5, 10)}px`,
              color: titleColor,
              fontWeight: isBold ? "bold" : "normal",
              fontStyle: isItalic ? "italic" : "normal",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              wordBreak: "break-word",
            }}
          >
            {cardTitle}
          </span>
        </div>
      )}
    </div>
  )
}

export { CustomCardPreview }
export default CustomCardPreview
