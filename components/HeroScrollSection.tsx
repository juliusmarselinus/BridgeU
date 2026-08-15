"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollSection() {
  return (
    <div className="relative w-full bg-clouds rounded-t-[3rem] shadow-[0_-12px_40px_-20px_rgba(18,40,75,0.25)] -mt-8">
      <div className="flex flex-col overflow-hidden pt-8">
        <ContainerScroll
          titleComponent={
            <>
              <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
                Lihat bagaimana <br />
                <span className="font-display text-4xl font-bold text-primary sm:text-6xl">
                  BridgeU bekerja
                </span>
              </h2>
            </>
          }
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <iframe
              src="https://www.youtube-nocookie.com/embed/WSNszd1CaZo?rel=0&modestbranding=1&playsinline=1"
              title="Preview BridgeU"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 rounded-2xl"
            />
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
}