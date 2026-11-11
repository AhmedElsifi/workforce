import 'package:equatable/equatable.dart';

class ProfileFormState extends Equatable {
  const ProfileFormState({
    this.isSubmitting = false,
    this.message,
    this.succeeded = false,
  });

  final bool isSubmitting;
  final String? message;
  final bool succeeded;

  ProfileFormState copyWith({
    bool? isSubmitting,
    String? message,
    bool? succeeded,
    bool clearMessage = false,
  }) {
    return ProfileFormState(
      isSubmitting: isSubmitting ?? this.isSubmitting,
      message: clearMessage ? null : (message ?? this.message),
      succeeded: succeeded ?? this.succeeded,
    );
  }

  @override
  List<Object?> get props => [isSubmitting, message, succeeded];
}
