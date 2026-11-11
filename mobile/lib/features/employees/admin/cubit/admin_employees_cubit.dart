import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/features/departments/admin/data/departments_repository.dart';

import '../data/admin_employee.dart';
import '../data/admin_employees_repository.dart';
import 'admin_employees_state.dart';

class AdminEmployeesCubit extends Cubit<AdminEmployeesState> {
  AdminEmployeesCubit(this._repository, this._departmentsRepository)
      : super(const AdminEmployeesState());

  final AdminEmployeesRepository _repository;
  final DepartmentsRepository _departmentsRepository;

  Future<void> loadInitial() async {
    try {
      final departments = await _departmentsRepository.fetch();
      emit(state.copyWith(departments: departments));
    } on ApiException {
      // Filter dropdown just stays empty; the employee list load below still
      // surfaces its own error if the server is unreachable.
    }
    await loadEmployees();
  }

  Future<void> loadEmployees() async {
    emit(state.copyWith(employees: Resource.loading(state.employees.data)));
    try {
      final employees = await _repository.fetch(state.filters);
      emit(state.copyWith(employees: Resource.success(employees)));
    } on ApiException catch (error) {
      emit(state.copyWith(employees: Resource.failure(error.message, state.employees.data)));
    }
  }

  Future<void> updateFilters(EmployeeFilters filters) async {
    emit(state.copyWith(filters: filters));
    await loadEmployees();
  }

  Future<bool> createEmployee({
    required String fname,
    required String lname,
    required String email,
    required String password,
    String? position,
    String? departmentId,
    double? salary,
  }) async {
    emit(state.copyWith(isSubmitting: true, clearFormMessage: true, formErrors: const {}));
    try {
      await _repository.create(
        fname: fname,
        lname: lname,
        email: email,
        password: password,
        position: position,
        departmentId: departmentId,
        salary: salary,
      );
      emit(state.copyWith(isSubmitting: false, formMessage: 'Employee added successfully.'));
      await loadEmployees();
      return true;
    } on ApiException catch (error) {
      emit(state.copyWith(
        isSubmitting: false,
        formMessage: error.message,
        formErrors: error.fieldErrors ?? const {},
      ));
      return false;
    }
  }

  Future<bool> updateEmployee(
    String id, {
    String? position,
    required String role,
    String? departmentId,
    double? salary,
    required String employmentStatus,
  }) async {
    emit(state.copyWith(isSubmitting: true, clearFormMessage: true, formErrors: const {}));
    try {
      await _repository.update(
        id,
        position: position,
        role: role,
        departmentId: departmentId,
        salary: salary,
        employmentStatus: employmentStatus,
      );
      emit(state.copyWith(isSubmitting: false, formMessage: 'Employee updated successfully.'));
      await loadEmployees();
      return true;
    } on ApiException catch (error) {
      emit(state.copyWith(
        isSubmitting: false,
        formMessage: error.message,
        formErrors: error.fieldErrors ?? const {},
      ));
      return false;
    }
  }

  Future<String?> deactivate(String id) async {
    try {
      await _repository.deactivate(id);
      await loadEmployees();
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }

  Future<String?> reactivate(AdminEmployee employee) async {
    try {
      await _repository.update(
        employee.id,
        position: employee.position,
        role: employee.role,
        departmentId: employee.departmentId,
        salary: employee.salary,
        employmentStatus: 'active',
      );
      await loadEmployees();
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }
}
