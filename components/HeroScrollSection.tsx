"use client";
import React from "react";
import Image from "next/image";
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
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&auto=format&fit=crop&q=80"
            alt="Preview dasbor BridgeU"
            height={720}
            width={1400}
            className="mx-auto h-full rounded-2xl object-cover object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
}