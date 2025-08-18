import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import Topbar from "@/components/header/Topbar";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
    console.log("window.innerWidth", window.innerWidth);

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 900);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Topbar isMobile={isMobile} />
      <ResizablePanelGroup direction="horizontal" className='flex-1 flex overflow-hidden p-2'>
        <AudioPlayer />
        {/* Left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>

        <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

        {/* Right content */}
        {/* <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
          collapsedSize={0}
        >
          right
        </ResizablePanel> */}
      </ResizablePanelGroup>
      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
