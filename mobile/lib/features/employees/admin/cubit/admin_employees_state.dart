import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/features/departments/data/department.dart';

import '../data/admin_employee.dart';
import '../data/admin_employees_repository.dart';

class AdminEmployeesState extends Equatable {
  const AdminEmployeesState({
    this.employees = const Resource.initial(),
    this.departments = const [],
    this.filters = const EmployeeFilters(),
    this.isSubmitting = false,
    this.formMessage,
    this.formErrors = const {},
  });

  final Resource<List<AdminEmployee>> employees;
  final List<Department> departments;
  final EmployeeFilters filters;
  final bool isSubmitting;
  final String? formMessage;
  final Map<String, dynamic> formErrors;

  AdminEmployeesState copyWith({
    Resource<List<AdminEmployee>>? employees,
    List<Department>? departments,
    EmployeeFilters? filters,
    bool? isSubmitting,
    String? formMessage,
    Map<String, dynamic>? formErrors,
    bool clearFormMessage = false,
  }) {
    return AdminEmployeesState(
      employees: employees ?? this.employees,
      departments: departments ?? this.departments,
      filters: filters ?? this.filters,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      formMessage: clearFormMessage ? null : (formMessage ?? this.formMessage),
      formErrors: formErrors ?? this.formErrors,
    );
  }

  @override
  List<Object?> get props =>
      [employees, departments, filters, isSubmitting, formMessage, formErrors];
}
