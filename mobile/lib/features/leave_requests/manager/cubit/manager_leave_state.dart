import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../../data/leave_request.dart';

enum ManagerLeaveFilter { pending, all }

class ManagerLeaveState extends Equatable {
  const ManagerLeaveState({
    this.filter = ManagerLeaveFilter.pending,
    this.requests = const Resource.initial(),
  });

  final ManagerLeaveFilter filter;
  final Resource<List<LeaveRequest>> requests;

  ManagerLeaveState copyWith({
    ManagerLeaveFilter? filter,
    Resource<List<LeaveRequest>>? requests,
  }) {
    return ManagerLeaveState(
      filter: filter ?? this.filter,
      requests: requests ?? this.requests,
    );
  }

  @override
  List<Object?> get props => [filter, requests];
}
