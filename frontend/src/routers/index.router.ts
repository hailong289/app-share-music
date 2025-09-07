import React from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'
import ChatPage from '@/pages/chat/ChatPage'
import MainLayout from '@/layout/MainLayout'
import HomePage from '@/pages/home/HomePage'
import NotFoundPage from '@/pages/404/NotFoundPage'
import AlbumPage from '@/pages/album/AlbumPage'
import Login from '@/pages/auth/Login'
import AdminPage from '@/pages/admin/AdminPage'
import PlaylistPage from '@/pages/playlist/PlaylistPage';
import SessionPage from '@/pages/session/SessionPage';
import ArtistPage from '@/pages/artist/ArtistPage'
import SearchPage from '@/pages/search/SearchPage'

// Định nghĩa cấu trúc route
export interface RouterConfig {
  path: string
  name: string
  component: React.ComponentType
  isProtected?: boolean
  children?: RouterConfig[]
}

const routeConfigs: RouterConfig[] = [
  // {
  //   path: '/auth-callback',
  //   name: 'Auth Callback',
  //   component: AuthCallbackPage
  // },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Main Layout',
    component: MainLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: HomePage
      },
      {
        path: '/chat',
        name: 'Chat',
        component: ChatPage
      },
      {
        path: '/session/:sessionId',
        name: 'Session Detail',
        component: SessionPage
      },
      {
        path: '/album/:albumId',
        name: 'Album Detail',
        component: AlbumPage
      },
      {
        path: '/playlist/:playlistId',
        name: 'Playlist Detail',
        component: PlaylistPage
      },
      {
        path: '/artist/:artistId',
        name: 'Artist Detail',
        component: ArtistPage
      },
      {
        path: '/search/:keyword',
        name: 'Search Results',
        component: SearchPage
      },
      {
        path: '*',
        name: 'Not Found',
        component: NotFoundPage
      }
    ]
  }
]

// Hàm helper để tạo routes từ config
const createRoutesFromConfig = (configs: RouterConfig[]): RouteObject[] => {
  return configs.map(config => ({
    path: config.path,
    element: React.createElement(config.component),
    children: config.children ? createRoutesFromConfig(config.children) : undefined
  }));
};

const router = createBrowserRouter(createRoutesFromConfig(routeConfigs));

export default router;
