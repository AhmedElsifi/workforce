import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/departments_repository.dart';
import 'admin_departments_state.dart';

class AdminDepartmentsCubit extends Cubit<AdminDepartmentsState> {
  AdminDepartmentsCubit(this._repository) : super(const AdminDepartmentsState());

  final DepartmentsRepository _repository;

  Future<void> loadInitial() async {
    try {
      final managers = await _repository.fetchManagers();
      emit(state.copyWith(managers: managers));
    } on ApiException {
      // Manager dropdown just stays empty; the list load below still surfaces
      // its own error if the server is unreachable.
    }
    await load();
  }

  Future<void> load() async {
    emit(state.copyWith(departments: Resource.loading(state.departments.data)));
    try {
      final departments = await _repository.fetch();
      emit(state.copyWith(departments: Resource.success(departments)));
    } on ApiException catch (error) {
      emit(state.copyWith(departments: Resource.failure(error.message, state.departments.data)));
    }
  }

  Future<bool> create({required String name, String? description, String? managerId}) async {
    emit(state.copyWith(isSubmitting: true, clearFormMessage: true, formErrors: const {}));
    try {
      await _repository.create(name: name, description: description, managerId: managerId);
      emit(state.copyWith(isSubmitting: false, formMessage: 'Department added successfully.'));
      await load();
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

  Future<bool> update(String id, {required String name, String? description, String? managerId}) async {
    emit(state.copyWith(isSubmitting: true, clearFormMessage: true, formErrors: const {}));
    try {
      await _repository.update(id, name: name, description: description, managerId: managerId);
      emit(state.copyWith(isSubmitting: false, formMessage: 'Department updated successfully.'));
      await load();
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

  Future<String?> delete(String id) async {
    try {
      await _repository.delete(id);
      await load();
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }
}
