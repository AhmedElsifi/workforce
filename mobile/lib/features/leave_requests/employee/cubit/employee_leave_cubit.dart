import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/employee_leave_repository.dart';
import 'employee_leave_state.dart';

class EmployeeLeaveCubit extends Cubit<EmployeeLeaveState> {
  EmployeeLeaveCubit(this._repository) : super(const EmployeeLeaveState());

  final EmployeeLeaveRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(requests: Resource.loading(state.requests.data)));
    try {
      final requests = await _repository.myRequests();
      emit(state.copyWith(requests: Resource.success(requests)));
    } on ApiException catch (error) {
      emit(state.copyWith(requests: Resource.failure(error.message, state.requests.data)));
    }
  }

  Future<void> submit({
    required String leaveType,
    required DateTime startDate,
    required DateTime endDate,
    required String reason,
  }) async {
    emit(state.copyWith(isSubmitting: true, clearSubmitMessage: true));
    try {
      await _repository.submit(
        leaveType: leaveType,
        startDate: startDate,
        endDate: endDate,
        reason: reason,
      );
      emit(state.copyWith(
        isSubmitting: false,
        submitMessage: 'Leave request submitted successfully.',
        submitSucceeded: true,
      ));
      await load();
    } on ApiException catch (error) {
      emit(state.copyWith(
        isSubmitting: false,
        submitMessage: error.message,
        submitSucceeded: false,
      ));
    }
  }
}
