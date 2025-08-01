import React from 'react'
import HomePage from '../pages/HomePage'
import CreatePage from '../pages/CreatePage'
import NoteDetailPage from '../pages/NoteDetailPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import ProfilePage from '../pages/ProfilePage'
import { createBrowserRouter, type RouteObject } from 'react-router'

// Định nghĩa cấu trúc route
export interface RouterConfig {
  path: string
  name: string
  component: React.ComponentType
  isProtected?: boolean
  children?: RouterConfig[]
}

const routeConfigs: RouterConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/create',
    name: 'Create Note',
    component: CreatePage,
    isProtected: true // Demo protected route
  },
  {
    path: '/note/:id',
    name: 'Note Detail',
    component: NoteDetailPage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  }
];

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