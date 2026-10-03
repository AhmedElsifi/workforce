import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/session/auth_cubit.dart';
import 'package:workforce_mobile/core/session/auth_state.dart';
import 'package:workforce_mobile/core/session/user_role.dart';
import 'package:workforce_mobile/core/widgets/role_shell.dart';
import 'package:workforce_mobile/features/attendance/employee/cubit/attendance_cubit.dart';
import 'package:workforce_mobile/features/attendance/employee/data/attendance_repository.dart';
import 'package:workforce_mobile/features/attendance/employee/presentation/screens/attendance_screen.dart';
import 'package:workforce_mobile/features/attendance/manager/cubit/department_attendance_cubit.dart';
import 'package:workforce_mobile/features/attendance/manager/data/department_attendance_repository.dart';
import 'package:workforce_mobile/features/attendance/manager/presentation/screens/department_attendance_screen.dart';
import 'package:workforce_mobile/features/audit/cubit/audit_cubit.dart';
import 'package:workforce_mobile/features/audit/data/audit_repository.dart';
import 'package:workforce_mobile/features/audit/presentation/screens/audit_screen.dart';
import 'package:workforce_mobile/features/auth/presentation/screens/login_screen.dart';
import 'package:workforce_mobile/features/dashboard/admin/cubit/admin_dashboard_cubit.dart';
import 'package:workforce_mobile/features/dashboard/admin/data/admin_dashboard_repository.dart';
import 'package:workforce_mobile/features/dashboard/admin/presentation/screens/admin_dashboard_screen.dart';
import 'package:workforce_mobile/features/dashboard/employee/cubit/employee_dashboard_cubit.dart';
import 'package:workforce_mobile/features/dashboard/employee/data/employee_dashboard_repository.dart';
import 'package:workforce_mobile/features/dashboard/employee/presentation/screens/employee_dashboard_screen.dart';
import 'package:workforce_mobile/features/dashboard/manager/cubit/manager_dashboard_cubit.dart';
import 'package:workforce_mobile/features/dashboard/manager/data/manager_dashboard_repository.dart';
import 'package:workforce_mobile/features/dashboard/manager/presentation/screens/manager_dashboard_screen.dart';
import 'package:workforce_mobile/features/departments/admin/cubit/admin_departments_cubit.dart';
import 'package:workforce_mobile/features/departments/admin/data/departments_repository.dart';
import 'package:workforce_mobile/features/departments/admin/presentation/screens/admin_departments_screen.dart';
import 'package:workforce_mobile/features/employees/admin/cubit/admin_employees_cubit.dart';
import 'package:workforce_mobile/features/employees/admin/data/admin_employees_repository.dart';
import 'package:workforce_mobile/features/employees/admin/presentation/screens/admin_employees_screen.dart';
import 'package:workforce_mobile/features/employees/manager/cubit/team_cubit.dart';
import 'package:workforce_mobile/features/employees/manager/data/team_repository.dart';
import 'package:workforce_mobile/features/employees/manager/presentation/screens/team_screen.dart';
import 'package:workforce_mobile/features/leave_requests/employee/cubit/employee_leave_cubit.dart';
import 'package:workforce_mobile/features/leave_requests/employee/data/employee_leave_repository.dart';
import 'package:workforce_mobile/features/leave_requests/employee/presentation/screens/my_leave_requests_screen.dart';
import 'package:workforce_mobile/features/leave_requests/manager/cubit/manager_leave_cubit.dart';
import 'package:workforce_mobile/features/leave_requests/manager/data/manager_leave_repository.dart';
import 'package:workforce_mobile/features/leave_requests/manager/presentation/screens/manager_leave_requests_screen.dart';
import 'package:workforce_mobile/features/profile/shared/cubit/profile_cubit.dart';
import 'package:workforce_mobile/features/profile/shared/presentation/screens/profile_screen.dart';
import 'package:workforce_mobile/features/auth/data/auth_repository.dart';

import 'go_router_refresh_stream.dart';

const _employeeItems = [
  RoleNavItem(icon: Icons.dashboard_outlined, activeIcon: Icons.dashboard, label: 'Dashboard'),
  RoleNavItem(icon: Icons.history_outlined, activeIcon: Icons.history, label: 'Attendance'),
  RoleNavItem(icon: Icons.description_outlined, activeIcon: Icons.description, label: 'Leave'),
  RoleNavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profile'),
];

const _managerItems = [
  RoleNavItem(icon: Icons.dashboard_outlined, activeIcon: Icons.dashboard, label: 'Dashboard'),
  RoleNavItem(icon: Icons.group_outlined, activeIcon: Icons.group, label: 'Team'),
  RoleNavItem(icon: Icons.fact_check_outlined, activeIcon: Icons.fact_check, label: 'Leave'),
  RoleNavItem(icon: Icons.schedule_outlined, activeIcon: Icons.schedule, label: 'Attendance'),
  RoleNavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profile'),
];

const _adminItems = [
  RoleNavItem(icon: Icons.dashboard_outlined, activeIcon: Icons.dashboard, label: 'Dashboard'),
  RoleNavItem(icon: Icons.group_outlined, activeIcon: Icons.group, label: 'Employees'),
  RoleNavItem(icon: Icons.domain_outlined, activeIcon: Icons.domain, label: 'Departments'),
  RoleNavItem(icon: Icons.security_outlined, activeIcon: Icons.security, label: 'Audit'),
  RoleNavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profile'),
];

String _roleHome(UserRole role) => switch (role) {
      UserRole.admin => '/admin/dashboard',
      UserRole.manager => '/manager/dashboard',
      UserRole.employee => '/employee/dashboard',
    };

GoRouter buildAppRouter({required ApiClient apiClient, required AuthCubit authCubit}) {
  final authRepository = AuthRepository(apiClient);

  GoRoute leaf(String path, Widget Function(BuildContext) builder) {
    return GoRoute(path: path, builder: (context, state) => builder(context));
  }

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: GoRouterRefreshStream(authCubit.stream),
    redirect: (context, state) {
      final authState = authCubit.state;
      final atLogin = state.matchedLocation == '/login';

      if (authState.status == AuthStatus.unknown) return null;

      if (!authState.isAuthenticated) {
        return atLogin ? null : '/login';
      }

      final role = authState.user!.role;
      final home = _roleHome(role);

      if (atLogin) return home;

      final allowedPrefix = '/${role.name}';
      if (!state.matchedLocation.startsWith(allowedPrefix)) return home;

      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => RoleShell(
          navigationShell: navigationShell,
          items: _employeeItems,
          title: 'Employee Portal',
        ),
        branches: [
          StatefulShellBranch(routes: [
            leaf(
              '/employee/dashboard',
              (context) => BlocProvider(
                create: (_) => EmployeeDashboardCubit(EmployeeDashboardRepository(apiClient)),
                child: const EmployeeDashboardScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/employee/attendance',
              (context) => BlocProvider(
                create: (_) => AttendanceCubit(AttendanceRepository(apiClient)),
                child: const AttendanceScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/employee/leave-requests',
              (context) => BlocProvider(
                create: (_) => EmployeeLeaveCubit(EmployeeLeaveRepository(apiClient)),
                child: const MyLeaveRequestsScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/employee/profile',
              (context) => BlocProvider(
                create: (_) => ProfileCubit(authRepository, authCubit),
                child: const ProfileScreen(),
              ),
            ),
          ]),
        ],
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => RoleShell(
          navigationShell: navigationShell,
          items: _managerItems,
          title: 'Manager Portal',
        ),
        branches: [
          StatefulShellBranch(routes: [
            leaf(
              '/manager/dashboard',
              (context) => BlocProvider(
                create: (_) => ManagerDashboardCubit(ManagerDashboardRepository(apiClient)),
                child: const ManagerDashboardScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/manager/team',
              (context) => BlocProvider(
                create: (_) => TeamCubit(TeamRepository(apiClient)),
                child: const TeamScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/manager/leave-requests',
              (context) => BlocProvider(
                create: (_) => ManagerLeaveCubit(ManagerLeaveRepository(apiClient)),
                child: const ManagerLeaveRequestsScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/manager/attendance',
              (context) => BlocProvider(
                create: (_) => DepartmentAttendanceCubit(DepartmentAttendanceRepository(apiClient)),
                child: const DepartmentAttendanceScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/manager/profile',
              (context) => BlocProvider(
                create: (_) => ProfileCubit(authRepository, authCubit),
                child: const ProfileScreen(),
              ),
            ),
          ]),
        ],
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => RoleShell(
          navigationShell: navigationShell,
          items: _adminItems,
          title: 'Admin Console',
        ),
        branches: [
          StatefulShellBranch(routes: [
            leaf(
              '/admin/dashboard',
              (context) => BlocProvider(
                create: (_) => AdminDashboardCubit(AdminDashboardRepository(apiClient)),
                child: const AdminDashboardScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/admin/employees',
              (context) => BlocProvider(
                create: (_) => AdminEmployeesCubit(
                  AdminEmployeesRepository(apiClient),
                  DepartmentsRepository(apiClient),
                ),
                child: const AdminEmployeesScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/admin/departments',
              (context) => BlocProvider(
                create: (_) => AdminDepartmentsCubit(DepartmentsRepository(apiClient)),
                child: const AdminDepartmentsScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/admin/audit',
              (context) => BlocProvider(
                create: (_) => AuditCubit(AuditRepository(apiClient)),
                child: const AuditScreen(),
              ),
            ),
          ]),
          StatefulShellBranch(routes: [
            leaf(
              '/admin/profile',
              (context) => BlocProvider(
                create: (_) => ProfileCubit(authRepository, authCubit),
                child: const ProfileScreen(),
              ),
            ),
          ]),
        ],
      ),
    ],
  );
}
