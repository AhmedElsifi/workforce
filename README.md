# WorkForce — Workforce Management System

A full-stack SME workforce platform built with **Node.js + Express + MongoDB** on the backend and **vanilla HTML / CSS / JavaScript** on the frontend. Three role-based portals: **Admin**, **Manager**, and **Employee**.

## Live demo

- Frontend: https://iti-project-workforce.vercel.app
- Backend API: https://workforce.de.deplexo.com

## Features

### Admin
- Dashboard with KPIs, department distribution and recent activity
- Employee CRUD (add, edit, activate / deactivate, filter, search)
- Department CRUD with manager assignment and headcount
- System audit log with pagination and category filter
- Full profile management

### Manager
- Department dashboard (headcount, active / inactive, pending leaves, clock-in rate ring)
- Department roster with activate / deactivate
- Review employee leave requests (approve / reject with comment)
- Daily department attendance view with date picker

### Employee
- Dashboard with attendance statistics
- Daily check-in / check-out (business timezone `Africa/Cairo`)
- Personal attendance history
- Submit and track leave requests
- Editable profile (name + password)

### Cross-cutting
- JWT auth in an httpOnly cookie
- Role-based authorization middleware
- Central `errorHandler` middleware with `AppError`
- Audit logging on every meaningful write action
- Dedicated 401 (session-expired) and 403 (unauthorized) pages
- Global fetch interceptor that redirects on 401 / 403

## Project structure
