import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent implements OnInit {
  key: any;
  bits: number[] = [];
  active!: number;
  decimal = '0';
  calcButtons = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '<', '0', 'C'];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(['0','1','2','3','4','5','6','7','8','9','c', 'C', '<'].includes(event.key)) {
      this.passNumber(event.key);
    }
   
  }

  ngOnInit(): void {
    this.populateBits();
  }

  private populateBits(): void {
    for (let i = 0; i < 64; i++) {
      this.bits.push(0);
    }
  }

  toggleBit(index: number): void {
    if (this.bits[index] === 0) {
      this.bits[index] = 1;
    } else {
      this.bits[index] = 0;
    }

    for (let i = 0; i < this.bits.length; i++) {
      if (this.bits[i] === 1) {
        this.active = i;
        break;
      }
    }
    this.decimal = this.toDecimal(this.bits).toString();
  }

  private toDecimal(binaryArray: number[]): number {
    let decimal = 0;
    for (let i = binaryArray.length - 1; i >= 0; i--) {
      let atPosition = (binaryArray.length - 1) - i;

      decimal += binaryArray[atPosition] * Math.pow(2, i);
    }

    return decimal;
  }

  private toBinary(number: number): number[] {
    let binary = [];
    while (number > 1) {
      if (Math.floor(number) % 2 === 0) {
        binary.push(0)
        number = number / 2;
      } else {
        binary.push(1);
        number = Math.floor(number / 2);
      }
    }
   
    binary.push(1);
    binary = binary.reverse();

    // Complete the binary array with leading zeros
    if (binary.length < 64) {
      const leadingZeros = 64 - binary.length;
      this.active = leadingZeros;
      for (let i = 0; i < leadingZeros; i++) {
        binary.unshift(0);
      }
    }
    return binary;
  }

  passNumber(btnNumber: any): void {
    console.log(btnNumber)
    switch (btnNumber) {
      case 'C':
      case 'c':
        this.decimal = '0';
        this.active = 64;
        this.bits = this.bits.map(bit => bit = 0);
        break;
      case '<':
        this.decimal = this.decimal.slice(0, -1);
        if (this.decimal.length) {
          this.bits = this.toBinary(+this.decimal);
        } else {
          console.log(this.bits)
          this.decimal = '0';
          this.active = 64;
          this.bits = this.bits.map(bit => 0);
        }
        break;
      default:
        this.decimal += btnNumber;

        if (this.decimal.length > 0 && this.decimal[0] === '0') {
            this.decimal = this.decimal.slice(1);
        }
        if (+this.decimal <= 1000000000000000000) {
          this.bits = this.toBinary(+this.decimal);
        } else {
          this.decimal = '999999999999999999';
          this.bits = this.toBinary(+this.decimal);
        }
        
    }

  }
}
