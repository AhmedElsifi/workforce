import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/attendance_record.dart';

class AttendanceState extends Equatable {
  const AttendanceState({
    this.history = const Resource.initial(),
    this.isSubmitting = false,
    this.actionMessage,
    this.actionSucceeded = false,
  });

  final Resource<List<AttendanceRecord>> history;
  final bool isSubmitting;
  final String? actionMessage;
  final bool actionSucceeded;

  /// Today's record, derived from history by matching the device's current
  /// local date — the server stamps `workDate` using Africa/Cairo time, so
  /// this is a close approximation good enough for showing the right button.
  AttendanceRecord? todayRecord(String todayWorkDate) {
    final list = history.data;
    if (list == null) return null;
    for (final record in list) {
      if (record.workDate == todayWorkDate) return record;
    }
    return null;
  }

  AttendanceState copyWith({
    Resource<List<AttendanceRecord>>? history,
    bool? isSubmitting,
    String? actionMessage,
    bool? actionSucceeded,
    bool clearActionMessage = false,
  }) {
    return AttendanceState(
      history: history ?? this.history,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      actionMessage: clearActionMessage ? null : (actionMessage ?? this.actionMessage),
      actionSucceeded: actionSucceeded ?? this.actionSucceeded,
    );
  }

  @override
  List<Object?> get props => [history, isSubmitting, actionMessage, actionSucceeded];
}
