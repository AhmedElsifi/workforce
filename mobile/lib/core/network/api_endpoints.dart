/// All backend route paths in one place, verbatim from the server's route
/// files under `server/src/modules/*`.
class ApiEndpoints {
  ApiEndpoints._();

  // Auth
  static const login = '/auth/login';
  static const me = '/auth/me';
  static const logout = '/auth/logout';

  // Dashboard
  static const dashboardEmployee = '/dashboard/employee';
  static const dashboardManager = '/dashboard/manager';
  static const dashboardAdmin = '/dashboard/admin';

  // Attendance
  static const attendanceCheckIn = '/attendance/check-in';
  static const attendanceCheckOut = '/attendance/check-out';
  static const attendanceHistory = '/attendance/history';
  static const attendanceDepartment = '/attendance/department';

  // Employees
  static const employees = '/employees';
  static String employeeById(String id) => '/employees/$id';
  static String employeeDeactivate(String id) => '/employees/$id/deactivate';
  static const myTeam = '/employees/department/my-team';
  static String employeeStatus(String id) => '/employees/$id/status';

  // Departments
  static const departments = '/departments';
  static String departmentById(String id) => '/departments/$id';
  static String departmentEmployees(String id) => '/departments/$id/employees';

  // Leave requests
  static const leaveRequestNew = '/leave-requests/new-request';
  static const leaveRequestMine = '/leave-requests/my-requests';
  static const leaveRequestPending = '/leave-requests/pending';
  static const leaveRequestAll = '/leave-requests';
  static String leaveRequestStatus(String id) => '/leave-requests/$id/status';

  // Audit
  static const audit = '/audit';
  static const auditRecent = '/audit/recent';
}
