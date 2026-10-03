import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../../data/leave_request.dart';

class EmployeeLeaveState extends Equatable {
  const EmployeeLeaveState({
    this.requests = const Resource.initial(),
    this.isSubmitting = false,
    this.submitMessage,
    this.submitSucceeded = false,
  });

  final Resource<List<LeaveRequest>> requests;
  final bool isSubmitting;
  final String? submitMessage;
  final bool submitSucceeded;

  EmployeeLeaveState copyWith({
    Resource<List<LeaveRequest>>? requests,
    bool? isSubmitting,
    String? submitMessage,
    bool? submitSucceeded,
    bool clearSubmitMessage = false,
  }) {
    return EmployeeLeaveState(
      requests: requests ?? this.requests,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      submitMessage: clearSubmitMessage ? null : (submitMessage ?? this.submitMessage),
      submitSucceeded: submitSucceeded ?? this.submitSucceeded,
    );
  }

  @override
  List<Object?> get props => [requests, isSubmitting, submitMessage, submitSucceeded];
}
