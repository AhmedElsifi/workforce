import 'package:intl/intl.dart';

/// Date/time/currency formatting shared across screens, matching the
/// wording style of the web client's own helpers.
class Formatters {
  Formatters._();

  static final _dateFormat = DateFormat('MMM d, yyyy');
  static final _dateTimeFormat = DateFormat('MMM d, yyyy • h:mm a');
  static final _timeFormat = DateFormat('h:mm a');
  static final _longDateFormat = DateFormat('EEE, MMM d, yyyy');

  static String date(DateTime? value) =>
      value == null ? '-' : _dateFormat.format(value.toLocal());

  static String longDate(DateTime? value) =>
      value == null ? '-' : _longDateFormat.format(value.toLocal());

  static String dateTime(DateTime? value) =>
      value == null ? '-' : _dateTimeFormat.format(value.toLocal());

  static String time(DateTime? value) =>
      value == null ? '-' : _timeFormat.format(value.toLocal());

  static String currency(num? value) {
    if (value == null) return '-';
    final format = NumberFormat.currency(symbol: '\$', decimalDigits: 0);
    return format.format(value);
  }

  static String dateRange(DateTime start, DateTime end) {
    final s = start.toLocal();
    final e = end.toLocal();
    if (s.year == e.year && s.month == e.month && s.day == e.day) {
      return date(s);
    }
    return '${date(s)} - ${date(e)}';
  }

  static String timeAgo(DateTime value) {
    final diff = DateTime.now().difference(value.toLocal());
    if (diff.inSeconds < 60) return 'just now';
    if (diff.inMinutes < 60) {
      final m = diff.inMinutes;
      return '$m minute${m == 1 ? '' : 's'} ago';
    }
    if (diff.inHours < 24) {
      final h = diff.inHours;
      return '$h hour${h == 1 ? '' : 's'} ago';
    }
    if (diff.inDays < 30) {
      final d = diff.inDays;
      return '$d day${d == 1 ? '' : 's'} ago';
    }
    if (diff.inDays < 365) {
      final mo = (diff.inDays / 30).floor();
      return '$mo month${mo == 1 ? '' : 's'} ago';
    }
    final y = (diff.inDays / 365).floor();
    return '$y year${y == 1 ? '' : 's'} ago';
  }

  static String initialsOf(String fname, String lname) {
    final f = fname.isNotEmpty ? fname[0] : '';
    final l = lname.isNotEmpty ? lname[0] : '';
    final result = '$f$l'.toUpperCase();
    return result.isEmpty ? '-' : result;
  }

  static String titleCase(String? value) {
    if (value == null || value.isEmpty) return '-';
    return value
        .split(' ')
        .map((w) => w.isEmpty ? w : '${w[0].toUpperCase()}${w.substring(1).toLowerCase()}')
        .join(' ');
  }

  static String workDateToLabel(String workDate) {
    try {
      final parts = workDate.split('-').map(int.parse).toList();
      return longDate(DateTime(parts[0], parts[1], parts[2]));
    } catch (_) {
      return workDate;
    }
  }
}
