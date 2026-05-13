#!/usr/bin/env python3
"""
Test runner script for backend tests

Usage:
    python run_tests.py                  # Run all tests
    python run_tests.py --unit           # Run unit tests only
    python run_tests.py --integration    # Run integration tests only
    python run_tests.py --coverage       # Run with coverage report
"""

import sys
import os
import argparse
import unittest

def run_unit_tests():
    """Run backend unit tests"""
    print("\n" + "="*60)
    print("RUNNING BACKEND UNIT TESTS")
    print("="*60)
    
    loader = unittest.TestLoader()
    suite = loader.discover('tests/unit', pattern='test_*.py')
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result.wasSuccessful()

def run_integration_tests():
    """Run backend integration tests"""
    print("\n" + "="*60)
    print("RUNNING BACKEND INTEGRATION TESTS")
    print("="*60)
    
    loader = unittest.TestLoader()
    suite = loader.discover('tests/integration', pattern='test_*.py')
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result.wasSuccessful()

def run_all_tests():
    """Run all backend tests"""
    print("\n" + "="*60)
    print("RUNNING ALL BACKEND TESTS")
    print("="*60)
    
    success = True
    success = run_unit_tests() and success
    success = run_integration_tests() and success
    
    return success

def run_with_coverage():
    """Run tests with coverage"""
    try:
        import coverage
    except ImportError:
        print("Coverage module not installed. Install with: pip install coverage")
        return False
    
    print("\n" + "="*60)
    print("RUNNING BACKEND TESTS WITH COVERAGE")
    print("="*60)
    
    cov = coverage.Coverage(
        source=['../src'],
        omit=['*/tests/*', '*/migrations/*', '*/__pycache__/*']
    )
    cov.start()
    
    success = run_all_tests()
    
    cov.stop()
    cov.save()
    
    print("\n" + "="*60)
    print("COVERAGE REPORT")
    print("="*60)
    cov.report()
    
    cov.html_report(directory='coverage_html')
    print(f"\nHTML coverage report generated in: {os.path.abspath('coverage_html/index.html')}")
    
    return success

def main():
    parser = argparse.ArgumentParser(description='Run backend tests for AromaAromas')
    parser.add_argument('--unit', action='store_true', help='Run unit tests only')
    parser.add_argument('--integration', action='store_true', help='Run integration tests only')
    parser.add_argument('--coverage', action='store_true', help='Run with coverage report')
    
    args = parser.parse_args()
    
    if args.coverage:
        success = run_with_coverage()
    elif args.unit:
        success = run_unit_tests()
    elif args.integration:
        success = run_integration_tests()
    else:
        success = run_all_tests()
    
    if success:
        print("\nAll tests passed!")
        sys.exit(0)
    else:
        print("\nSome tests failed!")
        sys.exit(1)

if __name__ == '__main__':
    main()