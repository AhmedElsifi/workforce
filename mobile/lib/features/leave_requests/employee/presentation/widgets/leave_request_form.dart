import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

import '../../cubit/employee_leave_cubit.dart';

const leaveTypes = ['Annual', 'Sick', 'Casual', 'Unpaid'];

class LeaveRequestForm extends StatefulWidget {
  const LeaveRequestForm({super.key, required this.isSubmitting});

  final bool isSubmitting;

  @override
  State<LeaveRequestForm> createState() => _LeaveRequestFormState();
}

class _LeaveRequestFormState extends State<LeaveRequestForm> {
  String _leaveType = leaveTypes.first;
  DateTime? _startDate;
  DateTime? _endDate;
  final _reasonController = TextEditingController();

  @override
  void dispose() {
    _reasonController.dispose();
    super.dispose();
  }

  Future<void> _pickDate({required bool isStart}) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 2),
    );
    if (picked == null) return;
    setState(() {
      if (isStart) {
        _startDate = picked;
      } else {
        _endDate = picked;
      }
    });
  }

  void _submit() {
    if (_startDate == null || _endDate == null || _reasonController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill in all fields.')),
      );
      return;
    }
    context.read<EmployeeLeaveCubit>().submit(
          leaveType: _leaveType,
          startDate: _startDate!,
          endDate: _endDate!,
          reason: _reasonController.text.trim(),
        );
    _reasonController.clear();
    setState(() {
      _startDate = null;
      _endDate = null;
      _leaveType = leaveTypes.first;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Submit a Leave Request',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppDropdownField<String>(
            label: 'Leave Type',
            value: _leaveType,
            items: leaveTypes,
            itemLabel: (item) => item,
            onChanged: (value) => setState(() => _leaveType = value ?? _leaveType),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _pickDate(isStart: true),
                  child: Text(_startDate == null ? 'Start Date' : Formatters.date(_startDate)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _pickDate(isStart: false),
                  child: Text(_endDate == null ? 'End Date' : Formatters.date(_endDate)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          AppTextField(label: 'Reason', controller: _reasonController, maxLines: 3),
          const SizedBox(height: 16),
          PrimaryButton(
            label: 'Submit Request',
            loading: widget.isSubmitting,
            onPressed: _submit,
          ),
        ],
      ),
    );
  }
}
