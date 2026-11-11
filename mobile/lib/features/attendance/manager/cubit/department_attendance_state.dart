import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/department_attendance_record.dart';

class DepartmentAttendanceState extends Equatable {
  DepartmentAttendanceState({
    DateTime? date,
    this.records = const Resource.initial(),
  }) : date = date ?? DateTime.now();

  final DateTime date;
  final Resource<List<DepartmentAttendanceRecord>> records;

  DepartmentAttendanceState copyWith({
    DateTime? date,
    Resource<List<DepartmentAttendanceRecord>>? records,
  }) {
    return DepartmentAttendanceState(
      date: date ?? this.date,
      records: records ?? this.records,
    );
  }

  @override
  List<Object?> get props => [date, records];
}
