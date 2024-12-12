class Idea < ApplicationRecord
  has_many :comments
  has_one_attached :picture
  validates :name, presence: true
end
