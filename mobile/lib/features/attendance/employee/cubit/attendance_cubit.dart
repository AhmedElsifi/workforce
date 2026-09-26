import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/attendance_repository.dart';
import 'attendance_state.dart';

class AttendanceCubit extends Cubit<AttendanceState> {
  AttendanceCubit(this._repository) : super(const AttendanceState());

  final AttendanceRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(history: Resource.loading(state.history.data)));
    try {
      final records = await _repository.history();
      emit(state.copyWith(history: Resource.success(records)));
    } on ApiException catch (error) {
      emit(state.copyWith(history: Resource.failure(error.message, state.history.data)));
    }
  }

  Future<void> checkIn() async {
    emit(state.copyWith(isSubmitting: true, clearActionMessage: true));
    try {
      await _repository.checkIn();
      emit(state.copyWith(
        isSubmitting: false,
        actionMessage: 'Checked in successfully.',
        actionSucceeded: true,
      ));
      await load();
    } on ApiException catch (error) {
      emit(state.copyWith(
        isSubmitting: false,
        actionMessage: error.message,
        actionSucceeded: false,
      ));
    }
  }

  Future<void> checkOut() async {
    emit(state.copyWith(isSubmitting: true, clearActionMessage: true));
    try {
      await _repository.checkOut();
      emit(state.copyWith(
        isSubmitting: false,
        actionMessage: 'Checked out successfully.',
        actionSucceeded: true,
      ));
      await load();
    } on ApiException catch (error) {
      emit(state.copyWith(
        isSubmitting: false,
        actionMessage: error.message,
        actionSucceeded: false,
      ));
    }
  }
}
