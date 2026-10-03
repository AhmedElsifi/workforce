import 'package:equatable/equatable.dart';

enum ResourceStatus { initial, loading, success, failure }

/// Small reusable holder every list/detail Cubit uses for its state instead
/// of hand-rolling loading/error/data fields each time.
class Resource<T> extends Equatable {
  const Resource._(this.status, this.data, this.message);

  const Resource.initial() : this._(ResourceStatus.initial, null, null);
  const Resource.loading([T? previous]) : this._(ResourceStatus.loading, previous, null);
  const Resource.success(T data) : this._(ResourceStatus.success, data, null);
  const Resource.failure(String message, [T? previous])
      : this._(ResourceStatus.failure, previous, message);

  final ResourceStatus status;
  final T? data;
  final String? message;

  bool get isInitial => status == ResourceStatus.initial;
  bool get isLoading => status == ResourceStatus.loading;
  bool get isSuccess => status == ResourceStatus.success;
  bool get isFailure => status == ResourceStatus.failure;
  bool get hasData => data != null;

  @override
  List<Object?> get props => [status, data, message];
}
