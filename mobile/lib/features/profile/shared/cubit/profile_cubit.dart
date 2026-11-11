import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/session/auth_cubit.dart';
import 'package:workforce_mobile/features/auth/data/auth_repository.dart';

import 'profile_state.dart';

/// Thin wrapper around [AuthRepository.updateCurrentUser] that owns the
/// profile form's own submit/loading/error state and pushes the refreshed
/// user back into the app-wide [AuthCubit] on success.
class ProfileCubit extends Cubit<ProfileFormState> {
  ProfileCubit(this._repository, this._authCubit) : super(const ProfileFormState());

  final AuthRepository _repository;
  final AuthCubit _authCubit;

  Future<void> save(Map<String, dynamic> fields) async {
    emit(state.copyWith(isSubmitting: true, clearMessage: true));
    try {
      final user = await _repository.updateCurrentUser(fields);
      _authCubit.applyUpdatedUser(user);
      emit(state.copyWith(
        isSubmitting: false,
        message: 'Profile updated successfully.',
        succeeded: true,
      ));
    } on ApiException catch (error) {
      emit(state.copyWith(isSubmitting: false, message: error.message, succeeded: false));
    }
  }
}
