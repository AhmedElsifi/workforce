import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../../data/department.dart';

class AdminDepartmentsState extends Equatable {
  const AdminDepartmentsState({
    this.departments = const Resource.initial(),
    this.managers = const [],
    this.isSubmitting = false,
    this.formMessage,
    this.formErrors = const {},
  });

  final Resource<List<Department>> departments;
  final List<ManagerOption> managers;
  final bool isSubmitting;
  final String? formMessage;
  final Map<String, dynamic> formErrors;

  AdminDepartmentsState copyWith({
    Resource<List<Department>>? departments,
    List<ManagerOption>? managers,
    bool? isSubmitting,
    String? formMessage,
    Map<String, dynamic>? formErrors,
    bool clearFormMessage = false,
  }) {
    return AdminDepartmentsState(
      departments: departments ?? this.departments,
      managers: managers ?? this.managers,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      formMessage: clearFormMessage ? null : (formMessage ?? this.formMessage),
      formErrors: formErrors ?? this.formErrors,
    );
  }

  @override
  List<Object?> get props =>
      [departments, managers, isSubmitting, formMessage, formErrors];
}
