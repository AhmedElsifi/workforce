import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/department_attendance_repository.dart';
import 'department_attendance_state.dart';

class DepartmentAttendanceCubit extends Cubit<DepartmentAttendanceState> {
  DepartmentAttendanceCubit(this._repository) : super(DepartmentAttendanceState());

  final DepartmentAttendanceRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(records: Resource.loading(state.records.data)));
    try {
      final records = await _repository.fetch(state.date);
      emit(state.copyWith(records: Resource.success(records)));
    } on ApiException catch (error) {
      emit(state.copyWith(records: Resource.failure(error.message, state.records.data)));
    }
  }

  Future<void> changeDate(DateTime date) async {
    emit(state.copyWith(date: date));
    await load();
  }
}
